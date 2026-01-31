import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

const API_BASE_URL = "http://192.168.1.90:5000/api";

const DriverLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");
  const [driverId, setDriverId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigation = useNavigation();

  // Fetch driver's assigned bus after successful login
  useEffect(() => {
    if (loginSuccess && driverId) {
      fetchAssignedBus();
    }
  }, [loginSuccess, driverId]);

  const fetchAssignedBus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers/${driverId}/buses`);
      if (response.data.availableBuses) {
        setBuses(response.data.availableBuses);
        if (response.data.availableBuses.length === 1) {
          setSelectedBus(response.data.availableBuses[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
      Alert.alert("⚠️ Error", "Failed to fetch assigned bus");
    }
  };

  const handleLogin = async () => {
    if (!email) {
      Alert.alert("⚠️ Missing Fields", "Please enter email");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/drivers/login`, {
        email: email.trim()
      });

      if (response.status === 200) {
        const driverData = response.data.driver;
        setDriverId(String(driverData.id));
        setLoginSuccess(true);
        
        // Fetch assigned bus immediately
        try {
          const busResponse = await axios.get(`${API_BASE_URL}/drivers/${driverData.id}/buses`);
          if (busResponse.data.availableBuses && busResponse.data.availableBuses.length > 0) {
            setBuses(busResponse.data.availableBuses);
            setSelectedBus(busResponse.data.availableBuses[0]); // Auto-select assigned bus
          }
        } catch (busError) {
          console.error("Error fetching buses:", busError);
        }
        
        Alert.alert("✅ Login Successful", `Welcome ${driverData.name}!`);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert("❌ Login Failed", "Driver not found. Only admin-added drivers can login.");
        } else if (error.response.status === 400) {
          Alert.alert("❌ Invalid Email", "Please enter a valid email address");
        } else if (error.response.status === 404) {
          Alert.alert("❌ Service Unavailable", "Login service not found. Please contact admin.");
        } else {
          Alert.alert("❌ Error", "Login failed. Please try again.");
        }
      } else {
        Alert.alert("❌ Network Error", "Could not connect to server. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusSelection = () => {
    if (buses.length === 0) {
      Alert.alert("⚠️ No Bus Assigned", "Please contact admin for bus assignment");
      return;
    }

    navigation.replace("DriverDashboard", {
      driverId: driverId,
      driverEmail: email,
      busId: buses[0], // Use assigned bus
    });
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Driver Login</Text>
        <Text style={styles.subtitle}>Login using your registered email</Text>

        {!loginSuccess ? (
          <>
            {/* EMAIL */}
            <TextInput
              style={styles.input}
              placeholder="Enter registered email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />

            {/* LOGIN BUTTON */}
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* ASSIGNED BUS DISPLAY */}
            <View style={styles.assignedBusContainer}>
              <Text style={styles.assignedBusTitle}>Your Assigned Bus</Text>
              {buses.length > 0 ? (
                <View style={styles.busDisplay}>
                  <Icon name="bus-outline" size={32} color="#2C3E50" />
                  <Text style={styles.assignedBusText}>{buses[0]}</Text>
                </View>
              ) : (
                <Text style={styles.noBusText}>No bus assigned</Text>
              )}
            </View>

            {/* CONTINUE TO DASHBOARD BUTTON */}
            <TouchableOpacity 
              style={[styles.button, buses.length === 0 && styles.buttonDisabled]} 
              onPress={handleBusSelection}
              disabled={buses.length === 0}
            >
              <Text style={styles.buttonText}>Continue to Dashboard</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default DriverLoginScreen;

/* ================= STYLES (UNCHANGED) ================= */

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    backgroundColor: "rgba(255, 255, 255, 0.49)",
    borderRadius: 25,
    padding: 25,
    width: "85%",
    alignItems: "center",
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 30,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#2C3E50",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  backButton: {
    marginTop: 20,
  },

  backText: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "600",
  },
  pickerWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  buttonDisabled: {
    backgroundColor: "#999",
    opacity: 0.6,
  },
  busSelectionTitle: {
    fontSize: 18,
    color: "#2C3E50",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  assignedBusContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2C3E50",
  },
  assignedBusTitle: {
    fontSize: 16,
    color: "#2C3E50",
    marginBottom: 10,
    fontWeight: "600",
  },
  busDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  assignedBusText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginLeft: 10,
  },
  noBusText: {
    fontSize: 14,
    color: "#e74c3c",
    fontStyle: "italic",
  },
});
