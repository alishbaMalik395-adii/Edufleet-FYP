import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const buses = [
  { id: "1", busNo: "BUS-01", route: "Piplan → University of Mianwali" },
  { id: "2", busNo: "BUS-02", route: "Kalabag → University of Mianwali" },
  { id: "3", busNo: "BUS-03", route: "Kamarmoshani → University of Mianwali" },
  { id: "4", busNo: "BUS-04", route: "Piplan, Hernoli Mor → University of Mianwali" },
  { id: "5", busNo: "BUS-05", route: "Esakhail → University of Mianwali" },
];

export default function BusSelectionScreen({ navigation }) {

  const renderBus = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("StartRideScreen", {
          busNo: item.busNo,
          routeName: item.route,
        })
      }
    >
      <View style={styles.iconWrap}>
        <Icon name="bus-outline" size={38} color="#fff" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.busNo}>{item.busNo}</Text>
        <Text style={styles.route}>{item.route}</Text>
      </View>

      <Icon name="chevron-forward" size={26} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}   // ✅ same as dashboard
    >
      {/* ✅ SAME DARK OVERLAY */}
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Select Your Bus 🚌</Text>
        <Text style={styles.subtitle}>
          Choose the bus you are assigned to
        </Text>

        <FlatList
          data={buses}
          keyExtractor={(item) => item.id}
          renderItem={renderBus}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  // 🔥 EXACT SAME OVERLAY
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.09)",
  },

  container: {
    paddingTop: 40,
    paddingHorizontal: 22,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffffff",
  },

  subtitle: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 28,
    color: "#eaeaea",
  },

  // 🔥 GLASS CARD (dashboard feel)
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.28)",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.66)",
    elevation: 18,
  },

  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(0, 0, 0, 0.49)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  busNo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  route: {
    fontSize: 14,
    marginTop: 4,
    color: "#f1f1f1",
  },
});
