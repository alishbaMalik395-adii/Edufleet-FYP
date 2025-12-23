// /Screens/TrackingScreen.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const ROUTE_COLORS = ["#FF5A5F", "#00A699", "#FFB400", "#007AFF", "#8E44AD"];

export default function TrackingScreen() {
  // --- mock initial buses (five buses, different routes) ---
  const [buses, setBuses] = useState([
    { id: "B1", busNo: "24B", route: "Campus → City", lat: 33.6844, lng: 73.0479 }, // example coords
    { id: "B2", busNo: "12A", route: "North → Campus", lat: 33.6890, lng: 73.0500 },
    { id: "B3", busNo: "7C",  route: "South → Campus", lat: 33.6800, lng: 73.0400 },
    { id: "B4", busNo: "3D",  route: "East → Campus",  lat: 33.6905, lng: 73.0600 },
    { id: "B5", busNo: "9X",  route: "West → Campus",  lat: 33.6750, lng: 73.0300 },
  ]);

  const mapRef = useRef(null);

  // simulate small movement so markers appear to move (demo only)
  useEffect(() => {
    const id = setInterval(() => {
      setBuses(prev =>
        prev.map((b, idx) => {
          // tiny random walk
          const dLat = (Math.random() - 0.5) * 0.0006;
          const dLng = (Math.random() - 0.5) * 0.0006;
          return { ...b, lat: b.lat + dLat, lng: b.lng + dLng };
        })
      );
    }, 5000); // update every 5s
    return () => clearInterval(id);
  }, []);

  // center map to first bus on mount
  useEffect(() => {
    if (mapRef.current && buses.length) {
      mapRef.current.animateToRegion({
        latitude: buses[0].lat,
        longitude: buses[0].lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 800);
    }
  }, []);

  // when user taps a marker, center map there
  const focusOnBus = bus => {
    if (!mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude: bus.lat,
      longitude: bus.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 600);
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.heading}>Live Bus Tracking</Text>
        <Text style={styles.subHeading}>Track all campus buses</Text>

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: buses[0].lat,
              longitude: buses[0].lng,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
          >
            {/* show markers */}
            {buses.map((bus, i) => (
              <Marker
                key={bus.id}
                coordinate={{ latitude: bus.lat, longitude: bus.lng }}
                title={`${bus.busNo} — ${bus.route}`}
                description={`Bus ID: ${bus.id}`}
                onPress={() => focusOnBus(bus)}
              >
                {/* custom marker: colored circle with busNo */}
                <View style={[styles.markerWrap, { borderColor: ROUTE_COLORS[i % ROUTE_COLORS.length] }]}>
                  <View style={[styles.markerInner, { backgroundColor: ROUTE_COLORS[i % ROUTE_COLORS.length] }]} />
                  <Text style={styles.markerText}>{bus.busNo}</Text>
                </View>
              </Marker>
            ))}

            {/* optional: draw polylines for routes (demo static lines) */}
            {/* Example polyline between few coords for bus 1 */}
            <Polyline
              coordinates={buses.slice(0, 3).map(b => ({ latitude: b.lat, longitude: b.lng }))}
              strokeColor={ROUTE_COLORS[0]}
              strokeWidth={3}
            />
          </MapView>
        </View>

        {/* quick legend + list to identify buses */}
        <View style={styles.legend}>
          {buses.map((b, i) => (
            <TouchableOpacity key={b.id} style={styles.legendItem} onPress={() => focusOnBus(b)}>
              <View style={[styles.legendDot, { backgroundColor: ROUTE_COLORS[i % ROUTE_COLORS.length] }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.legendTitle}>{b.busNo} — {b.route}</Text>
                <Text style={styles.legendSub}>Last update: a few seconds ago</Text>
              </View>
              <Text style={styles.legendETA}>ETA 5m</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  container: { flex: 1, paddingTop: 80, paddingHorizontal: 12 },

  heading: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 6 },
  subHeading: { color: "#e6e6e6", marginBottom: 8 },

  mapContainer: { flex: 1, borderRadius: 16, overflow: "hidden", marginVertical: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  map: { width: "100%", height: "100%" },

  markerWrap: { alignItems: "center", justifyContent: "center", padding: 2, borderRadius: 24, borderWidth: 2 },
  markerInner: { width: 18, height: 18, borderRadius: 9, marginBottom: 2 },
  markerText: { color: "#fff", fontWeight: "700", fontSize: 12, textAlign: "center" },

  legend: { backgroundColor: "rgba(255,255,255,0.06)", padding: 8, borderRadius: 12, marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  legendDot: { width: 14, height: 14, borderRadius: 7, marginRight: 8 },
  legendTitle: { color: "#fff", fontWeight: "700" },
  legendSub: { color: "#ddd", fontSize: 12 },
  legendETA: { color: "#fff", fontWeight: "700", marginLeft: 8 },
});
