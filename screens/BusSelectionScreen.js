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
      onPress={() =>
        navigation.navigate("StartRideScreen", {
          busNo: item.busNo,
          routeName: item.route,
        })
      }
    >
      <View style={styles.iconWrap}>
        <Icon name="bus-outline" size={40} color="#fff" />
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
      blurRadius={1}
    >
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
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    fontSize: 17,
    marginTop: 6,
    marginBottom: 25,
    color: "#eaeaea",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.66)",
    elevation: 18,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.35)",
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
