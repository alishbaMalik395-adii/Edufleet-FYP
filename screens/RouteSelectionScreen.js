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

export default function RouteSelectionScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      {/* DARK OVERLAY */}
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Select Route</Text>
        <Text style={styles.subtitle}>
          Choose your assigned route
        </Text>

        <FlatList
          data={busRoutes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("RouteInformationScreen", {
                  //routeData: item,
                  routeId: item.id,
                })
              }
            >
              {/* Icon */}
              <View style={styles.iconWrap}>
                <Icon name="navigate-outline" size={22} color="#fff" />
              </View>

              {/* Text */}
              <View style={{ flex: 1 }}>
                <Text style={styles.routeName}>{item.name}</Text>
                <Text style={styles.routeDesc}>
                  Tap to view route details
                </Text>
              </View>

              <Icon name="chevron-forward" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        />
      </View>
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

  card: {
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

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  routeName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },

  routeDesc: {
    fontSize: 12,
    color: "#ddd",
    marginTop: 4,
  },
});
