import React, { useState, useEffect } from "react";

import {

  View,

  Text,

  StyleSheet,

  ImageBackground,

  TouchableOpacity,

  FlatList,

  Alert,

} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import io from 'socket.io-client';

import { useFocusEffect } from '@react-navigation/native';



import Icon from "react-native-vector-icons/Ionicons";

import { busRoutes } from "../data/busRoutes";

import { useNotifications } from "../context/NotificationContext";



export default function MessagesScreen({ navigation, route }) {

  const { role = "user", busId: assignedBusId, userName = "You", regNo } = route.params || {};

  const { notifications, userRouteId, clearRouteNotifications } = useNotifications();

  

  // State for tracking new messages

  const [newMessageCounts, setNewMessageCounts] = useState({});

  const [socket, setSocket] = useState(null);

  const [busGroups, setBusGroups] = useState(busRoutes.map(route => ({

    ...route,

    lastMessage: 'No messages yet',

    time: '10:41 AM',

    hasNewMessage: false,

    driverName: null,

    senderType: null,

  })));

  

  // Helper function to get assigned route ID

  const getAssignedRouteId = () => {

    if (!assignedBusId) return 'R1';

    let cleanBusId = String(assignedBusId).trim()

      .replace('BUS-', '').replace('Bus-', '');

    const mapping = {

      '01': 'R1', '1': 'R1',

      '02': 'R2', '2': 'R2',

      '03': 'R3', '3': 'R3',

      '04': 'R4', '4': 'R4',

      '05': 'R5', '5': 'R5',

    };

    return mapping[cleanBusId] || 'R1';

  };

  const assignedRouteId = getAssignedRouteId();

  

  // Helper function to get group ID from route ID

  const getGroupIdFromRoute = (routeId) => {

    const mapping = {

      'R1': 'R1',

      'R2': 'R2',

      'R3': 'R3',

      'R4': 'R4',

      'R5': 'R5'

    };

    return mapping[routeId] || routeId;

  };

  

  console.log("=== MessagesScreen Debug ===");

  console.log("Full route params:", route.params);

  console.log("Role:", role);

  console.log("Assigned Bus ID:", assignedBusId);

  console.log("User Name:", userName);

  console.log("Reg No:", regNo);

  console.log("Bus Routes:", busRoutes);

  

  // Show all routes but restrict access (like BusSelectionScreen)

  const isRouteAssigned = (routeId) => {

    // Both users and drivers with assigned bus should be restricted

    if (!assignedBusId) return true; // If no bus assigned, allow all

    

    console.log(`=== Route Assignment Check ===`);

    console.log(`Route ID: ${routeId}`);

    console.log(`Assigned Bus ID: ${assignedBusId}`);

    console.log(`Role: ${role}`);

    

    // Simple mapping - handle different formats

    let cleanBusId = String(assignedBusId).trim();

    

    // Remove "BUS-" prefix if exists

    if (cleanBusId.includes("BUS-")) {

      cleanBusId = cleanBusId.replace("BUS-", "");

    } else if (cleanBusId.includes("Bus-")) {

      cleanBusId = cleanBusId.replace("Bus-", "");

    }

    

    console.log(`Clean Bus ID: "${cleanBusId}"`);

    

    // Direct mapping - return true if this route should be assigned

    if (cleanBusId === "01" && routeId === "R1") return true;

    if (cleanBusId === "02" && routeId === "R2") return true;

    if (cleanBusId === "03" && routeId === "R3") return true;

    if (cleanBusId === "04" && routeId === "R4") return true;

    if (cleanBusId === "05" && routeId === "R5") return true;

    

    // Also handle single digit format

    if (cleanBusId === "1" && routeId === "R1") return true;

    if (cleanBusId === "2" && routeId === "R2") return true;

    if (cleanBusId === "3" && routeId === "R3") return true;

    if (cleanBusId === "4" && routeId === "R4") return true;

    if (cleanBusId === "5" && routeId === "R5") return true;

    

    return false;

  };

  

  // Initialize message counts to 0 (no persistence - only count NEW messages)
  useEffect(() => {

    setNewMessageCounts({});
    console.log('Message counts initialized to 0');

  }, []);



  // Reload message counts when screen is focused (user comes back from chat)

  useFocusEffect(

    React.useCallback(() => {

      // Clear all message counts when returning from chat
      setNewMessageCounts({});
      console.log('Message counts cleared after returning from chat');



      // Clear hasNewMessage flag when screen is focused

      setBusGroups(prev => prev.map(group => ({

        ...group,

        hasNewMessage: false

      })));



      // Also reload last messages to show current time

      const loadLastMessages = async () => {

        try {

          const response = await fetch(`http://192.168.1.90:5000/api/messages/${assignedRouteId}`);

          if (response.ok) {

            const result = await response.json();

            const msgs = result.data || [];

            if (msgs.length > 0) {

              const lastMsg = msgs[msgs.length - 1];

              setBusGroups(prev => prev.map(group => {

                // Check if this is the assigned route

                let cleanBusId = String(assignedBusId).trim()

                  .replace('BUS-', '').replace('Bus-', '');

                const mapping = {

                  '01': 'R1', '1': 'R1',

                  '02': 'R2', '2': 'R2',

                  '03': 'R3', '3': 'R3',

                  '04': 'R4', '4': 'R4',

                  '05': 'R5', '5': 'R5',

                };

                const routeId = mapping[cleanBusId] || 'R1';

                

                if (group.id === routeId) {

                  return {

                    ...group,

                    lastMessage: lastMsg.message,

                    time: new Date(lastMsg.time).toLocaleTimeString([], {

                      hour: '2-digit', minute: '2-digit'

                    }),

                    driverName: lastMsg.senderName,

                    senderType: lastMsg.senderType,

                    hasNewMessage: false, // Clear indicator since we just loaded

                  };

                }

                return group;

              }));

            }

          }

        } catch (e) {

          console.log('Could not reload messages:', e.message);

        }

      };

      

      loadLastMessages();

    }, [assignedBusId, assignedRouteId])

  );

  

  // Socket connection and real-time updates

  useEffect(() => {

    // Initialize socket connection

    const newSocket = io('http://192.168.1.90:5000', {

      transports: ['websocket', 'polling'],

      jsonp: false

    });

    setSocket(newSocket);

    

    // Register as observer on connect

    newSocket.on('connect', () => {

      console.log('MessagesScreen socket connected');

      newSocket.emit('register', {

        clientId: 'app_observer_' + Date.now(),

        clientType: role,

        routeId: assignedRouteId, 

        userName: userName

      });

    });

    

    // Listen for new messages on socket

    newSocket.on('new_message', (message) => {

      console.log('MessagesScreen received new_message:', message);

      const groupId = getGroupIdFromRoute(message.routeId);

      if (!groupId) return;

      

      // Skip counting own messages (sender is current user)

      if (message.senderName === userName || 

          (regNo && message.senderName === regNo)) {

        console.log('Skipping own message count');

      } else {

        // Update unread count for other users' messages only

        setNewMessageCounts(prev => {

          const updatedCounts = {

            ...prev,

            [groupId]: (prev[groupId] || 0) + 1

          };

          return updatedCounts;

        });

      }

      

      // Update last message on route card (for all messages including own)

      setBusGroups(prev => prev.map(group => {

        if (group.id === groupId) {

          return {

            ...group,

            lastMessage: message.message,

            time: new Date().toLocaleTimeString([], { 

              hour: '2-digit', minute: '2-digit' 

            }),

            hasNewMessage: true,

            driverName: message.senderName,

            senderType: message.senderType,

          };

        }

        return group;

      }));

    });

    

    return () => {

      if (newSocket) {

        newSocket.disconnect();

      }

    };

  }, [assignedRouteId, role, userName, regNo]);

  

  const handleRoutePress = (routeItem) => {

    console.log("Pressed route:", routeItem.name);

    console.log("Route ID:", routeItem.id);

    console.log("Assigned Bus ID:", assignedBusId);

    

    if (!isRouteAssigned(routeItem.id)) {

      Alert.alert(

        "Access Denied ❌",

        `Aap sirf apni assigned bus route ${assignedBusId} me enter kar sakti hain`

      );

      return;

    }

    

    // Clear notification badge for this route

    setNewMessageCounts(prev => {

      const updatedCounts = {

        ...prev,

        [routeItem.id]: 0

      };

      return updatedCounts;

    });

    

    // Clear hasNewMessage flag for this route

    setBusGroups(prev => prev.map(group => 

      group.id === routeItem.id ? { ...group, hasNewMessage: false } : group

    ));

    

    // Clear route notifications in context

    clearRouteNotifications(routeItem.id);

    

    navigation.navigate("ChatScreen", { 

      routeId: routeItem.id,

      routeName: routeItem.name,

      role: role,

      busId: assignedBusId,

      userName: userName,

      regNo: regNo

    });

  };



  return (

    <ImageBackground

      source={require("../assets/background.jpg")}

      style={styles.bg}

      blurRadius={1}

    >

      <View style={styles.overlay} />



      <View style={styles.container}>

        <Text style={styles.title}>

          {role === "driver" ? "Bus Routes" : "Bus Groups"}

        </Text>

        <Text style={styles.subtitle}>

          {role === "driver" ? "Aap sirf apni assigned route me enter kar sakti hain" : "Start your chat"}

        </Text>



        <FlatList

          data={busGroups} // Use state instead of busRoutes directly

          keyExtractor={(item) => item.id}

          contentContainerStyle={{ paddingBottom: 30 }}

          showsVerticalScrollIndicator={false}

          renderItem={({ item }) => {

            const isAssigned = isRouteAssigned(item.id);

            const newMessageCount = newMessageCounts[item.id] || 0;

            

            return (

              <TouchableOpacity

                style={[

                  styles.chatCard,

                  isAssigned && styles.assignedCard, // 🔥 Active highlighting for assigned route

                  !isAssigned && { opacity: 0.55 }, // 🔥 baqi routes thori fade

                ]}

                activeOpacity={0.85}

                onPress={() => handleRoutePress(item)}

              >

                {/* Avatar */}

                <View

                  style={[

                    styles.avatar,

                    { backgroundColor: item.color || "rgba(0,0,0,0.35)" },

                  ]}

                >

                  <Icon name="bus-outline" size={22} color="#fff" />

                </View>



                {/* Text */}

                <View style={{ flex: 1 }}>

                  <Text style={styles.groupName}>{item.name}</Text>

                  <Text style={[

                    styles.lastMsg,

                    item.hasNewMessage && isAssigned && styles.lastMsgBold

                  ]} numberOfLines={1}>

                    {isAssigned 

                      ? (item.lastMessage && item.lastMessage !== 'No messages yet'

                          ? (item.senderType === 'admin' ? '👨‍💼 Admin: ' : 

                             item.driverName ? `${item.driverName}: ` : '')

                            + item.lastMessage

                          : "Your assigned route - Click to chat")

                      : "Not assigned to you - Access denied"

                    }

                  </Text>

                  

                  {/* 🔥 ASSIGNED TAG */}

                  {isAssigned && (

                    <Text style={styles.assignedTag}>Assigned to you ✓</Text>

                  )}

                </View>



                {/* Time and Notification Badge */}

                <View style={{ alignItems: 'flex-end' }}>

                  <Text style={[

                    styles.time,

                    item.hasNewMessage && isAssigned && styles.timeGreen

                  ]}>

                    {item.time || '10:41 AM'}

                  </Text>

                  {newMessageCount > 0 && (

                    <View style={styles.notificationBadge}>

                      <Text style={styles.notificationText}>{newMessageCount}</Text>

                    </View>

                  )}

                </View>

              </TouchableOpacity>

            );

          }}

        />

      </View>

    </ImageBackground>

  );

}



const styles = StyleSheet.create({

  bg: {

    flex: 1,

  },



  overlay: {

    ...StyleSheet.absoluteFillObject,

    backgroundColor: "rgba(0,0,0,0.35)",

  },



  container: {

    paddingTop: 80,

    paddingHorizontal: 22,

  },



  title: {

    fontSize: 30,

    fontWeight: "800",

    color: "#fff",

  },



  subtitle: {

    fontSize: 15,

    color: "#eaeaea",

    marginTop: 6,

    marginBottom: 25,

  },



  chatCard: {

    flexDirection: "row",

    alignItems: "center",

    padding: 18,

    marginBottom: 16,



    backgroundColor: "rgba(255,255,255,0.28)",

    borderRadius: 22,

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.66)",

  },



  avatar: {

    width: 48,

    height: 48,

    borderRadius: 24,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 15,

  },



  groupName: {

    fontSize: 17,

    fontWeight: "700",

    color: "#fff",

  },



  lastMsg: {

    color: "#ddd",

    fontSize: 12,

    marginTop: 4,

  },



  lastMsgBold: {

    color: '#ffffff',

    fontWeight: '600',

  },



  time: {

    color: "#ddd",

    fontSize: 11,

  },



  timeGreen: {

    color: '#00ffcc',

    fontWeight: '600',

  },



  assignedTag: {

    marginTop: 6,

    fontSize: 12,

    fontWeight: "700",

    color: "#00ffcc",

  },



  assignedCard: {

    borderColor: "#00ffcc",

    borderWidth: 2,

    backgroundColor: "rgba(0, 255, 204, 0.1)",

  },



  notificationBadge: {

    position: 'absolute',

    top: -5,

    right: -5,

    backgroundColor: '#FF3B30',

    borderRadius: 10,

    minWidth: 20,

    height: 20,

    justifyContent: 'center',

    alignItems: 'center',

  },



  notificationText: {

    color: '#fff',

    fontSize: 11,

    fontWeight: 'bold',

  },

});



