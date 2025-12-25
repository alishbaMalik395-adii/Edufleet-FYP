import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { busRoutes } from "../data/busRoutes";

export default function MessagesScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}   // ✅ same as dashboard
    >
      {/* 🔥 DARK OVERLAY */}
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Bus Groups</Text>
        <Text style={styles.subtitle}>
          Start your chat 
        </Text>

        <FlatList
          data={busRoutes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("ChatScreen", { routeId: item.id })
              }
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
                <Text style={styles.lastMsg}>
                  Last message · a few sec ago
                </Text>
              </View>

              {/* Time */}
              <Text style={styles.time}>10:41 AM</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  // 🔥 SAME OVERLAY AS DASHBOARD
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

  // 🔥 GLASS CHAT CARD
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 16,

    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.66)",

    elevation: 18,
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

  time: {
    color: "#ddd",
    fontSize: 11,
  },
});
