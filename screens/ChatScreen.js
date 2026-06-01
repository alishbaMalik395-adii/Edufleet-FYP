// Screens/ChatScreen.js



import React, { useEffect, useRef, useState } from "react";

import {

  View,

  Text,

  StyleSheet,

  ImageBackground,

  FlatList,

  TextInput,

  TouchableOpacity,

  KeyboardAvoidingView,

  Platform,

  SafeAreaView,

  ActivityIndicator,

  Alert,

} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/Ionicons";

import io from 'socket.io-client';

import { useFocusEffect } from '@react-navigation/native';



export default function ChatScreen({ route }) {

  const routeId = route.params?.routeId || "R1";

  const routeName = route.params?.routeName || "Route Chat";

  const role = route.params?.role || "user";

  const busId = route.params?.busId;

  const userName = route.params?.userName || "You";

  const regNo = route.params?.regNo; // Get regNo directly from route.params

  

  console.log('=== CHAT SCREEN PARAMS DEBUG ===');

  console.log('Real regNo:', regNo);

  console.log('Reg No type:', typeof regNo);

  console.log('Reg No value:', JSON.stringify(regNo));



  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  const [socket, setSocket] = useState(null);

  const [adminSocket, setAdminSocket] = useState(null);

  const flatRef = useRef(null);

  

  // Backend server URL

  const SERVER_URL = "http://10.49.78.126:5000";

  const ADMIN_PORTAL_URL = "http://10.49.78.126:5000";



  // Initialize Socket.IO connection and load messages

  useEffect(() => {

    const loadMessages = async () => {

      setLoading(true);

      

      // Initialize Socket.IO connection with retry logic

      const newSocket = io(SERVER_URL, {

        transports: ['websocket', 'polling'],

        jsonp: false,

        timeout: 5000,

        forceNew: true

      });

      

      // Also connect to admin portal for notifications

      const adminSock = io(ADMIN_PORTAL_URL, {

        transports: ['websocket', 'polling'],

        timeout: 5000,

        forceNew: true

      });

      

      newSocket.on('connect', () => {

        console.log('✅ Socket connected successfully');

        console.log('Socket ID:', newSocket.id);

        console.log('Connected to:', SERVER_URL);

        setSocket(newSocket);

      });

      

      adminSock.on('connect', () => {

        console.log('✅ Admin socket connected successfully');

        console.log('Admin Socket ID:', adminSock.id);

        console.log('Connected to admin portal:', ADMIN_PORTAL_URL);

        setAdminSocket(adminSock);

      });

      

      newSocket.on('connect_error', (error) => {

        console.log('❌ Socket connection error:', error.message);

        console.log('Error details:', error);

      });

      

      adminSock.on('connect_error', (error) => {

        console.log('❌ Admin socket connection error:', error.message);

      });

      

      newSocket.on('disconnect', (reason) => {

        console.log('❌ Socket disconnected. Reason:', reason);

      });

      

      // Register with the server

      let displayName;

      console.log('=== DISPLAY NAME DEBUG ===');
      console.log('role:', role);
      console.log('regNo:', regNo);
      console.log('userName:', userName);

      if (role === "driver") {

        displayName = userName;

      } else {

        if (regNo && regNo.trim() !== "") {

          displayName = regNo.trim();

        } else if (userName && userName !== "You") {

          displayName = userName;

        } else {

          displayName = "User";

        }

      }

      console.log('displayName will be:', displayName);

      

      const registrationData = {

        clientId: displayName,

        clientType: role,

        routeId: routeId,

        userName: displayName

      };

      

      console.log('🔔 Registering with server:');

      console.log('Registration data:', registrationData);

      

      console.log('Registering socket with:', registrationData);
      newSocket.emit('register', registrationData);

      

      console.log('📡 Registration emitted, waiting for server response...');

      

      setSocket(newSocket);

      

      // Listen for real-time messages

      newSocket.on('new_message', (message) => {

        console.log('=== NEW MESSAGE RECEIVED ===');

        console.log('Full message object:', message);

        console.log('Current routeId:', routeId);

        console.log('Message routeId:', message.routeId);

        console.log('Route match:', message.routeId === routeId);

        

        if (message.routeId === routeId) {

          console.log('✅ Route matches! Adding message to chat...');

          const formattedMessage = {

            id: `backend_${message.id}_${Date.now()}`,

            text: message.message,

            senderName: message.senderName,

            senderType: message.senderType,

            time: new Date(message.time),

          };

          console.log('Formatted message:', formattedMessage);

          setMessages(prev => {

            console.log('Previous messages count:', prev.length);

            const newMessages = [...prev, formattedMessage];

            console.log('New messages count:', newMessages.length);

            return newMessages;

          });

          

          // Save to local storage as backup

          const storageKey = `chat_${routeId}`;

          saveMessagesToStorage(storageKey, [...messages, formattedMessage]);

        } else {

          console.log('❌ Route ID mismatch!');

          console.log('Expected routeId:', routeId);

          console.log('Received routeId:', message.routeId);

        }

      });

      

      // Listen for notifications

      newSocket.on('notification', (notification) => {

        if (notification.routeId === routeId) {

          console.log('Received notification:', notification);

          // You can update notification badge here

        }

      });

      

      // Try to load from backend first, then fallback to local storage

      try {

        console.log('Fetching messages from backend...');

        const response = await fetch(`${SERVER_URL}/api/messages/${routeId}`);

        console.log('Response status:', response.status);

        

        if (response.ok) {

          const result = await response.json();

          const backendMessages = result.data || [];

          console.log('Backend messages loaded:', backendMessages);

          

          if (backendMessages.length > 0) {

            const formattedMessages = backendMessages.map(msg => ({

              id: `backend_${msg.id}_${Date.now()}_${Math.random()}`,

              text: msg.message,

              senderName: msg.senderName,

              senderType: msg.senderType,

              time: new Date(msg.time),

            }));

            setMessages(formattedMessages);

            await saveMessagesToStorage(`chat_${routeId}`, formattedMessages);

          } else {

            // Load from local storage if backend has no messages

            await loadFromLocalStorage();

          }

        } else {

          console.log('Backend response not ok, loading from local storage');

          // Backend not available, load from local storage

          await loadFromLocalStorage();

        }

      } catch (error) {

        console.log('Backend not available, loading from local storage:', error.message);

        await loadFromLocalStorage();

      }

      

      setLoading(false);

    };

    

    const loadFromLocalStorage = async () => {

      const storageKey = `chat_${routeId}`;

      const storedMessages = await loadMessagesFromStorage(storageKey);

      

      if (storedMessages && storedMessages.length > 0) {

        setMessages(storedMessages);

      } else {

        // Initial welcome messages

        const initialMessages = [

          {

            id: "1",

            text: role === "driver" ? "Route update: Bus will arrive in 5 minutes." : "Welcome to route chat! Admin messages will appear here when connected.",

            senderName: role === "driver" ? "Admin" : "System",

            senderType: role === "driver" ? "admin" : "system",

            time: new Date(),

          },

        ];

        setMessages(initialMessages);

        await saveMessagesToStorage(storageKey, initialMessages);

      }

    };

    

    loadMessages();

    

    // Cleanup on unmount

    return () => {

      if (socket) {

        socket.disconnect();

      }

      if (adminSocket) {

        adminSocket.disconnect();

      }

    };

  }, [routeId, role]);



  // Function to load messages from storage

  const loadMessagesFromStorage = async (key) => {

    try {

      const jsonValue = await AsyncStorage.getItem(key);

      return jsonValue != null ? JSON.parse(jsonValue) : null;

    } catch (error) {

      console.log("Error loading messages:", error);

      return null;

    }

  };



  // Function to save messages to storage

  const saveMessagesToStorage = async (key, messageList) => {

    try {

      const jsonValue = JSON.stringify(messageList);

      await AsyncStorage.setItem(key, jsonValue);

      console.log(`Saved ${messageList.length} messages to ${key}`);

    } catch (error) {

      console.log("Error saving messages:", error);

    }

  };



  const sendMessage = async () => {

    if (!text.trim()) return;



    // Use regNo for users, userName for drivers

    let displayName;

    if (role === "driver") {

      displayName = userName;

    } else {

      if (regNo && regNo.trim() !== "") {

        displayName = regNo.trim();

      } else if (userName && userName !== "You") {

        displayName = userName;

      } else {

        displayName = "User";

      }

    }



    const messageData = {

      senderId: displayName,

      senderName: displayName,

      senderType: role,

      routeId: routeId,

      message: text.trim()

    };



    // Send via Socket.IO for real-time delivery

    if (socket) {

      socket.emit('send_message', messageData);

    }



    // Add message to local state immediately for sender's own display

    const tempMessage = {

      id: `temp_${Date.now()}_${Math.random()}`,

      text: text.trim(),

      senderName: displayName,

      senderType: role,

      time: new Date(),

    };

    setMessages(prev => [...prev, tempMessage]);



    // Send notification to admin portal

    if (adminSocket) {

      const adminNotification = {

        title: `New message from ${role}`,

        message: text.trim(),

        routeId: routeId,

        senderName: displayName,

        senderType: role,

        time: new Date().toISOString()

      };

      console.log('Sending notification to admin portal:', adminNotification);

      adminSocket.emit('user_message_notification', adminNotification);

    }



    setText("");



    setTimeout(() => {

      flatRef.current?.scrollToEnd({ animated: true });

    }, 100);

  };



  // Clear message count when chat screen is focused (user is viewing chat)
  // Note: Message counts are now managed in-memory in MessagesScreen only

  useFocusEffect(

    React.useCallback(() => {

      console.log(`Chat screen focused for route ${routeId}`);

      return () => {

        // Optional: cleanup when screen loses focus

      };

    }, [routeId])

  );



  // Function to format time like WhatsApp

  const formatTime = (date) => {

    const now = new Date();

    const messageTime = new Date(date);

    const diffMs = now - messageTime;

    const diffMins = Math.floor(diffMs / 60000);

    const diffHours = Math.floor(diffMs / 3600000);

    const diffDays = Math.floor(diffMs / 86400000);



    if (diffMins < 1) {

      return "just now";

    } else if (diffMins < 60) {

      return `${diffMins} min ago`;

    } else if (diffHours < 24) {

      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    } else if (diffDays < 7) {

      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    } else {

      // For older messages, show date

      return messageTime.toLocaleDateString([], {

        month: 'short',

        day: 'numeric'

      });

    }

  };



  const renderItem = ({ item }) => {

    const isMe = item.senderType === role; // Check if message is from current user



    return (

      <View

        style={[

          styles.messageRow,

          isMe ? styles.rightAlign : styles.leftAlign,

        ]}

      >

        <View

          style={[

            styles.messageBubble,

            isMe ? styles.myBubble : styles.otherBubble,

          ]}

        >

          {!isMe && (

            <Text style={styles.senderName}>{item.senderName}</Text>

          )}



          <Text style={styles.messageText}>{item.text}</Text>



          <Text style={styles.timeText}>

            {formatTime(item.time)}

          </Text>

        </View>

      </View>

    );

  };



  return (

    <ImageBackground

      source={require("../assets/background.jpg")}

      style={styles.bg}

      blurRadius={1}

    >

      <View style={styles.overlay} />



      <SafeAreaView style={styles.container}>

        {/* HEADER */}

        <Text style={styles.title}>{routeName}</Text>

        <Text style={styles.subtitle}>Live Chat Support</Text>



        {/* CHAT AREA */}

        <View style={styles.chatArea}>

          {loading ? (

            <ActivityIndicator size="large" color="#fff" />

          ) : (

            <FlatList

              ref={flatRef}

              data={messages}

              keyExtractor={(item, index) => `${item.id}_${index}`}

              renderItem={renderItem}

              contentContainerStyle={{ paddingBottom: 20 }}

              onContentSizeChange={() =>

                flatRef.current?.scrollToEnd({ animated: true })

              }

            />

          )}

        </View>



        {/* INPUT */}

        <KeyboardAvoidingView

          behavior={Platform.OS === "ios" ? "padding" : "height"}

        >

          <View style={styles.inputWrap}>

            <View style={styles.inputCard}>

              <TextInput

                value={text}

                onChangeText={setText}

                placeholder="Type a message"

                placeholderTextColor="#666"

                style={styles.input}

                multiline

              />

              <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>

                <Icon name="send" size={20} color="#fff" />

              </TouchableOpacity>

            </View>

          </View>

        </KeyboardAvoidingView>

      </SafeAreaView>

    </ImageBackground>

  );

}



const styles = StyleSheet.create({

  bg: { flex: 1 },

  overlay: {

    ...StyleSheet.absoluteFillObject,

    backgroundColor: "rgba(0,0,0,0.35)",

  },

  container: {

    flex: 1,

    paddingTop: 60,

    paddingHorizontal: 12,

  },



  title: {

    color: "#fff",

    fontSize: 26,

    fontWeight: "800",

  },

  subtitle: {

    color: "#ddd",

    marginBottom: 10,

  },



  chatArea: {

    flex: 1,

    marginTop: 10,

  },



  /* MESSAGE */

  messageRow: {

    marginVertical: 6,

    maxWidth: "80%",

  },

  leftAlign: {

    alignSelf: "flex-start",

  },

  rightAlign: {

    alignSelf: "flex-end",

  },



  messageBubble: {

    padding: 10,

    borderRadius: 12,

  },

  myBubble: {

    backgroundColor: "#DCF8C6",

    borderTopRightRadius: 0,

  },

  otherBubble: {

    backgroundColor: "#fff",

    borderTopLeftRadius: 0,

  },



  senderName: {

    fontSize: 12,

    fontWeight: "700",

    color: "#075E54",

    marginBottom: 2,

  },

  messageText: {

    fontSize: 15,

    color: "#000",

  },

  timeText: {

    fontSize: 10,

    color: "#555",

    alignSelf: "flex-end",

    marginTop: 4,

  },



  /* INPUT */

  inputWrap: {

    paddingVertical: 8,

  },

  inputCard: {

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#fff",

    borderRadius: 30,

    paddingHorizontal: 15,

  },

  input: {

    flex: 1,

    fontSize: 16,

    color: "#000",

    maxHeight: 100,

  },

  sendBtn: {

    backgroundColor: "#25D366",

    width: 44,

    height: 44,

    borderRadius: 22,

    justifyContent: "center",

    alignItems: "center",

    marginLeft: 10,

  },

});


