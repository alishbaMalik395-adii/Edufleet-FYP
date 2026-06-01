import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/Ionicons";

export default function StudentLiveMapScreen({ route }) {
  const { busNo, busId } = route?.params || {};

  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  // Demo-only: set a static location on mount (no backend)
  useEffect(() => {
    setLocation({
      latitude: 33.6844,
      longitude: 73.0479,
    });
  }, [busId]);

  // Auto-focus map on latest bus location
  useEffect(() => {
    if (!location) return;
    if (!mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  }, [location]);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={{ flex: 1 }}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      {/* HEADER */}
      <View style={styles.header}>
        <Icon name="bus-outline" size={26} color="#fff" />
        <Text style={styles.headerText}>
          Live Bus Location {busNo ? `- ${busNo}` : ""}
        </Text>
      </View>

      {/* MAP */}
      <View style={styles.mapCard}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          region={{
            latitude: location?.latitude || 33.6844,
            longitude: location?.longitude || 73.0479,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {location && (
            <Marker
              coordinate={location}
              title="Bus Live Location"
            />
          )}
        </MapView>

        {!location && (
          <Text style={styles.loadingText}>
            Fetching bus location...
          </Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  header: {
    marginTop: 70,
    marginHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 10,
  },
  mapCard: {
    margin: 22,
    flex: 1,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
  },
  loadingText: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
