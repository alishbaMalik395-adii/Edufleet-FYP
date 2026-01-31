import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const buses = [
  { id: "1", busNo: "BUS-01", route: "Piplan → University of Mianwali" },
  { id: "2", busNo: "BUS-02", route: "Kalabag → University of Mianwali" },
  { id: "3", busNo: "BUS-03", route: "Kamarmoshani → University of Mianwali" },
  {
    id: "4",
    busNo: "BUS-04",
    route: "Piplan, Hernoli Mor → University of Mianwali",
  },
  { id: "5", busNo: "BUS-05", route: "Esakhail → University of Mianwali" },
  { id: "6", busNo: "BUS-06", route: "Mochh → University of Mianwali" },
  { id: "7", busNo: "BUS-07", route: "Kot Kashmir → University of Mianwali" },
  { id: "8", busNo: "BUS-08", route: "Bhakkar → University of Mianwali" },
  { id: "9", busNo: "BUS-09", route: "Daud Khel → University of Mianwali" },
  { id: "10", busNo: "BUS-10", route: "Mianwali City → University of Mianwali" },
];

export default function BusSelectionScreen({ navigation, route }) {
  // 🔥 LOGIN SE AANE WALI ASSIGNED BUS ID
  const assignedBusId = String(route?.params?.assignedBusId);
  console.log("=== DEBUG ===");
  console.log("Assigned Bus ID:", assignedBusId);
  console.log("Route params:", route?.params);
  console.log("Buses data:", buses);

  const handleBusPress = (bus) => {
    console.log("=== CLICK DEBUG ===");
    console.log("Clicked bus:", bus);
    console.log("bus.busNo:", bus.busNo);
    console.log("bus.id:", bus.id);
    console.log("assignedBusId:", assignedBusId);
    
    // Normalize both values for comparison
    const clickedBusNo = bus.busNo.trim().toUpperCase();
    const assignedBus = assignedBusId.trim().toUpperCase();
    const clickedBusId = String(bus.id).trim();
    
    console.log("Normalized clickedBusNo:", clickedBusNo);
    console.log("Normalized assignedBus:", assignedBus);
    console.log("Normalized clickedBusId:", clickedBusId);
    
    // ❌ WRONG BUS - Check both normalized values
    if (clickedBusNo !== assignedBus && clickedBusId !== assignedBus) {
      console.log("ACCESS DENIED - Both comparisons failed");
      Alert.alert(
        "Access Denied ❌",
        `Aap sirf ${assignedBusId} me enter kar sakti hain`
      );
      return;
    }

    console.log("ACCESS GRANTED");
    // ✅ CORRECT BUS
    navigation.navigate("StartRideScreen", {
      busNo: bus.busNo,
      routeName: bus.route,
      busId: bus.id,
      driverId: route.params.driverId,
    });
  };

  const renderBus = ({ item }) => {
    // Check if this bus is assigned (compare both busNo and id with normalization)
    const clickedBusNo = item.busNo.trim().toUpperCase();
    const assignedBus = assignedBusId.trim().toUpperCase();
    const clickedBusId = String(item.id).trim();
    
    const isAssigned = clickedBusNo === assignedBus || clickedBusId === assignedBus;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          !isAssigned && { opacity: 0.55 }, // 🔥 baqi buses thori fade
        ]}
        activeOpacity={0.85}
        onPress={() => handleBusPress(item)}
      >
        <View style={styles.iconWrap}>
          <Icon name="bus-outline" size={38} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.busNo}>{item.busNo}</Text>
          <Text style={styles.route}>{item.route}</Text>

          {/* 🔥 OPTIONAL TAG */}
          {isAssigned && (
            <Text style={styles.assignedTag}>Assigned to you</Text>
          )}
        </View>

        <Icon name="chevron-forward" size={26} color="#fff" />
      </TouchableOpacity>
    );
  };

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
          Aap sirf apni assigned bus select kar sakti hain
        </Text>

        <FlatList
          data={buses}                 // 🔥 SAB BUSES
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
  bg: { flex: 1 },

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
    color: "#fff",
  },

  subtitle: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 28,
    color: "#eaeaea",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.28)",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.66)",
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

  assignedTag: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#00ffcc",
  },
});
