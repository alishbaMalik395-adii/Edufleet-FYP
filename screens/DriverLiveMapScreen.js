import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

const API_BASE_URL = "http://192.168.1.90:5000/api";

export default function DriverLiveMapScreen({ route }) {
  //console.log(" DriverLiveMapScreen opened");
//console.log(" route.params =", route?.params);

  const { rideStarted, busNo, busId, driverId } = route.params || {};

  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const mapRef = useRef(null);
  const hasAutoFocusedRef = useRef(false);

  // 🔐 REQUEST LOCATION PERMISSION
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message:
                "App needs access to your location to show live bus tracking",
              buttonPositive: "OK",
            }
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasPermission(true);
            console.log(" Location permission granted");
          } else {
            console.log("❌ Location permission denied");
            Alert.alert(
              "Permission Required",
              "Please allow location permission to continue. Go to Settings > Apps > EduFleet > Permissions > Location",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Settings", onPress: () => Linking.openSettings() }
              ]
            );
          }
        } catch (err) {
          console.warn("Permission error:", err);
          Alert.alert("Error", "Could not request location permission");
        }
      } else {
        setHasPermission(true);
        console.log(" iOS location permission");
      }
    };

    requestPermission();
  }, []);

  // ⚠️ RIDE STATUS CHECK
  useEffect(() => {
    if (!rideStarted) {
      Alert.alert(
        "Ride not started",
        "Please start the ride first to see live location"
      );
    }
  }, [rideStarted]);

  // GET REAL CURRENT LOCATION IMMEDIATELY
  useEffect(() => {
    if (!rideStarted || !hasPermission) return;

    console.log("🚀 Getting current location...");

    // Get current location immediately with fallback
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        console.log(" SUCCESS - Current Location:", latitude, longitude);
        
        // Set current location immediately
        setLocation({
          latitude,
          longitude,
        });

        // Send to backend
        sendLocationToBackend(latitude, longitude);

        // Auto-focus map on current location with zoom
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.animateToRegion(
              {
                latitude,
                longitude,
                latitudeDelta: 0.002, // Tight zoom
                longitudeDelta: 0.002, // Tight zoom
              },
              1000
            );
          }
        }, 500);
      },
      (error) => {
        console.log("❌ Location Error Details:", error);
        
        let errorMessage = "Could not get your current location";
        let useFallback = false;
        
        if (error.code === 1) {
          errorMessage = "Location permission denied. Using fallback location.";
          useFallback = true;
        } else if (error.code === 2) {
          errorMessage = "Location unavailable. Using fallback location.";
          useFallback = true;
        } else if (error.code === 3) {
          errorMessage = "Location request timeout. Using fallback location.";
          useFallback = true;
        }
        
        // Use fallback location (Mianwali University area)
        if (useFallback) {
          const fallbackLat = 32.6844;
          const fallbackLng = 73.0479;
          
          console.log(" Using fallback location:", fallbackLat, fallbackLng);
          
          setLocation({
            latitude: fallbackLat,
            longitude: fallbackLng,
          });

          sendLocationToBackend(fallbackLat, fallbackLng);

          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.animateToRegion(
                {
                  latitude: fallbackLat,
                  longitude: fallbackLng,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                },
                1000
              );
            }
          }, 500);
        }
        
        Alert.alert("Location Error", errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000, // Increased to 30 seconds
        maximumAge: 60000, // Accept 1 minute old location
      }
    );
  }, [rideStarted, hasPermission, driverId, busId]);

  //  AUTO-FOCUS MAP ON LOCATION UPDATES
  useEffect(() => {
    if (!rideStarted) return;
    if (!location) return;
    if (!mapRef.current) return;
    if (hasAutoFocusedRef.current) return;

    hasAutoFocusedRef.current = true;

    // Focus on current location with zoom
    mapRef.current.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.002, // Tight zoom
        longitudeDelta: 0.002, // Tight zoom
      },
      1000
    );
  }, [rideStarted, location]);

  //  SEND LOCATION TO BACKEND
  const sendLocationToBackend = async (latitude, longitude) => {
    if (!driverId || !busId) return;
    
    try {
      await axios.post(`${API_BASE_URL}/drivers/location`, {
        driverId: driverId,
        busId: busId,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.log("Location update error:", error);
    }
  };

  // LIVE LOCATION TRACKING WITH BACKEND SYNC
  useEffect(() => {
    if (!rideStarted || !hasPermission) return;

    const watchId = Geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude,
          longitude,
        });

        // Send location to backend
        sendLocationToBackend(latitude, longitude);
      },
      (error) => {
        console.log("Location error:", error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
      }
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [rideStarted, hasPermission, driverId, busId]);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={{ flex: 1 }}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      {/* HEADER */}
      <View style={styles.header}>
        <Icon name="map-outline" size={26} color="#fff" />
        <Text style={styles.headerText}>
          Live Location {busNo ? `- ${busNo}` : ""}
        </Text>
      </View>

      {/* MAP */}
      <View style={styles.mapCard}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          showsUserLocation={true}
          followsUserLocation={true}
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
            Fetching live location...
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
