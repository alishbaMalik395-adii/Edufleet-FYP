import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const DriverLoginSuccessScreen = ({ route }) => {
  const navigation = useNavigation();
  const { driverId, driverEmail, driverName, faceVerified } = route.params || {};

  // Animation values
  const scaleAnimation = new Animated.Value(0);
  const opacityAnimation = new Animated.Value(0);

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate to DriverLogin after 2 seconds to show assigned bus
    const timer = setTimeout(() => {
      navigation.replace("DriverLogin", {
        driverId,
        driverEmail,
        driverName,
        showAssignedBus: true,
        faceVerified: true,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.successContainer,
            {
              transform: [{ scale: scaleAnimation }],
              opacity: opacityAnimation,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Icon 
              name={faceVerified ? "checkmark-circle" : "log-in"} 
              size={80} 
              color={faceVerified ? "#4CAF50" : "#2196F3"} 
            />
          </View>
          
          <Text style={styles.successTitle}>Login Successful!</Text>
          <Text style={styles.welcomeText}>Welcome, {driverName || "Driver"}!</Text>
          
          {faceVerified ? (
            <View style={styles.verificationStatus}>
              <Icon name="shield-checkmark" size={24} color="#4CAF50" />
              <Text style={styles.verificationText}>Face Verified</Text>
            </View>
          ) : (
            <View style={styles.verificationStatus}>
              <Icon name="warning" size={24} color="#FF9800" />
              <Text style={styles.verificationTextWarning}>Face Verification Skipped</Text>
            </View>
          )}
          
          <Text style={styles.redirectingText}>Redirecting to assigned bus...</Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            navigation.replace("DriverLogin", {
              driverId,
              driverEmail,
              driverName,
              showAssignedBus: true,
              faceVerified,
            });
          }}
        >
          <Text style={styles.skipButtonText}>Skip to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  successContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 40,
    borderRadius: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  verificationStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  verificationText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 8,
  },
  verificationTextWarning: {
    fontSize: 16,
    color: "#FF9800",
    fontWeight: "600",
    marginLeft: 8,
  },
  redirectingText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  skipButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  skipButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DriverLoginSuccessScreen;
