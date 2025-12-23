import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList
} from "react-native";

import { busRoutes } from "../data/busRoutes"; // Correct path ✔

export default function MessagesScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}  // Background ✔
      style={styles.background}
      blurRadius={5}  // Soft blur like dashboard ✔
    >
      <Text style={styles.title}>Bus Groups</Text>
      <Text style={styles.subtitle}>Chat with drivers & students</Text>

      <FlatList
        data={busRoutes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatCard}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("ChatScreen", { routeId: item.id })
            }
          >
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: item.color }]} />

            {/* Text Area */}
            <View style={{ flex: 1 }}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.lastMsg}>Last message · a few sec ago</Text>
            </View>

            {/* Time */}
            <Text style={styles.time}>10:41 AM</Text>
          </TouchableOpacity>
        )}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Transparent overlay
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffffff",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 14,
    color: "#ffffffff",
    marginBottom: 20,
  },

  // 🔥 Glassy Chat Card
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,

    backgroundColor: "rgba(255, 255, 255, 0)",  // Glass effect
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.53)",

    backdropFilter: "blur(10px)",  // iOS Glass ✔
    shadowColor: "#000000bf",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5, // Android shadow
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 15,
  },

  groupName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
  },

  lastMsg: {
    color: "#ddd",
    fontSize: 12,
    marginTop: 2,
  },

  time: {
    color: "#fff",
    fontSize: 11,
  },
});
