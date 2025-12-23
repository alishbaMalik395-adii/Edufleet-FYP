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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function ChatScreen({ route }) {
  const { routeId = "R1", routeName = "Route Chat" } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const flatRef = useRef(null);

  /* 🔹 Dummy initial messages */
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setMessages([
        {
          id: "1",
          text: "Bus will arrive in 5 minutes.",
          senderName: "Admin",
          senderType: "admin",
          time: new Date(),
        },
        {
          id: "2",
          text: "Okay, thank you 👍",
          senderName: "You",
          senderType: "user",
          time: new Date(),
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      text: text.trim(),
      senderName: "You",
      senderType: "user",
      time: new Date(),
    };

    setMessages(prev => [...prev, newMsg]);
    setText("");

    setTimeout(() => {
      flatRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = ({ item }) => {
    const isMe = item.senderType === "user";

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
            {new Date(item.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
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
              keyExtractor={item => item.id}
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
    elevation: 8,
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
