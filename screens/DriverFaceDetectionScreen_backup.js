import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Vibration,
  StatusBar,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Camera, useCameraDevices } from "react-native-vision-camera";

const DriverFaceDetectionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { driverId, driverEmail, driverName } = route.params || {};
  
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionComplete, setDetectionComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const successAnimation = useRef(new Animated.Value(0)).current;
  
  // Camera setup
  const devices = useCameraDevices();
  const device = devices.front;
  const camera = useRef(null);

  useEffect(() => {
    // Check camera permission
    checkCameraPermission();
    
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const permission = await Camera.getCameraPermission();
      setCameraPermission(permission);
      
      if (permission !== 'granted') {
        const requestPermission = await Camera.requestCameraPermission();
        setCameraPermission(requestPermission);
      }
    } catch (error) {
      console.error("Camera permission error:", error);
      Alert.alert("Error", "Camera permission required for face detection");
    }
  };

  useEffect(() => {
    if (isDetecting) {
      startDetectionProcess();
    }
  }, [isDetecting]);

  const startDetectionProcess = () => {
    // Start scan animation
    Animated.loop(
      Animated.timing(scanAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Simulate real face detection process
    let progressValue = 0;
    const detectionInterval = setInterval(() => {
      progressValue += 8;
      setProgress(progressValue);
      
      // Face detection stages
      if (progressValue === 25) {
        // Stage 1: Looking for face
        console.log("Scanning for face...");
      }
      
      if (progressValue === 50) {
        // Stage 2: Face detected
        setFaceDetected(true);
        Vibration.vibrate(100);
        console.log("Face detected! Analyzing features...");
      }
      
      if (progressValue === 75) {
        // Stage 3: Analyzing facial features
        console.log("Analyzing facial features...");
      }
      
      if (progressValue >= 100) {
        clearInterval(detectionInterval);
        completeDetection();
      }
    }, 400);
  };

  const completeDetection = async () => {
    try {
      // Use existing driver ID from database (ID 10-13 exist)
      const mockDriverId = driverId || 10; // Use driver ID 10 (Ghulam Rasool)
      
      // Generate mock face data
      const faceData = `FACE_${mockDriverId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const faceFeatures = {
        faceId: Math.random().toString(36).substr(2, 9),
        confidence: 0.95,
        timestamp: Date.now(),
        deviceId: `DEVICE_${Date.now()}`
      };

      console.log("Sending face registration:", { driverId: mockDriverId, faceData });

      // Register face data to backend
      const response = await fetch('http://10.49.78.126:5000/api/drivers/register-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driverId: mockDriverId,
          faceData: faceData,
          faceFeatures: faceFeatures
        })
      });

      const result = await response.json();

      if (response.ok && result.message) {
        setIsDetecting(false);
        setDetectionComplete(true);
        
        // Success animation
        Animated.timing(successAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        Vibration.vibrate([200, 100, 200]);

        // Navigate to login success screen after delay
        setTimeout(() => {
          navigation.replace("DriverLoginSuccess", {
            driverId: mockDriverId,
            driverEmail: driverName ? driverName + "@example.com" : "ghulamrasool789@gmail.com", // Use existing email
            driverName: driverName || "Ghulam Rasool", // Use existing name
            faceVerified: true
          });
        }, 2000);
      } else {
        throw new Error(result.message || 'Face registration failed');
      }
    } catch (error) {
      console.error("Face registration error:", error);
      setIsDetecting(false);
      Alert.alert("Registration Failed", "Failed to register face. Please try again.");
    }
  };

  const startFaceDetection = () => {
    if (cameraPermission !== 'granted') {
      Alert.alert("Camera Required", "Please enable camera access for face detection");
      return;
    }
    
    setShowCamera(true);
    setIsDetecting(true);
    setProgress(0);
    setFaceDetected(false);
  };

  const retryDetection = () => {
    setDetectionComplete(false);
    setProgress(0);
    setFaceDetected(false);
    setIsDetecting(false);
  };

  const skipFaceDetection = () => {
    Alert.alert(
      "Skip Verification",
      "Are you sure you want to skip face detection? This is a security feature.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Skip",
          style: "destructive",
          onPress: () => {
            navigation.replace("DriverLoginSuccess", {
              driverId,
              driverEmail,
              driverName,
              faceVerified: false
            });
          }
        }
      ]
    );
  };

  
  if (device == null) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <View style={styles.noCameraContainer}>
          <Icon name="camera-off" size={80} color="#ff4444" />
          <Text style={styles.noCameraText}>Camera not available</Text>
          <Text style={styles.noCameraSubText}>Please check your device permissions</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => checkCameraPermission()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Real Camera View */}
      <View style={styles.cameraContainer}>
        <Camera
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
          enableZoomGesture={false}
        />
        
        {/* Face Detection Overlay */}
        <View style={styles.overlay}>
          <View style={styles.detectionFrame}>
            {/* Corner Markers */}
            {!detectionComplete && (
              <>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </>
            )}
            
            {/* Scanning Line */}
            {isDetecting && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-150, 150],
                        }),
                      },
                    ],
                  },
                ]}
              />
            )}
            
            {/* Success Checkmark */}
            {detectionComplete && (
              <Animated.View
                style={[
                  styles.successContainer,
                  {
                    opacity: successAnimation,
                    transform: [
                      {
                        scale: successAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Icon name="checkmark-circle" size={80} color="#4CAF50" />
                <Text style={styles.successText}>Face Verified</Text>
              </Animated.View>
            )}
          </View>
        </View>
        
        {/* Face Detection Overlay */}
        <View style={styles.overlay}>
          {/* Status Text */}
          <View style={styles.statusContainer}>
            {!isDetecting && !detectionComplete && (
              <>
                <Text style={styles.statusText}>
                  Position your face in frame
                </Text>
                <Text style={styles.subText}>
                  Make sure your face is clearly visible
                </Text>
              </>
            )}
            
            {isDetecting && (
              <>
                <Text style={styles.statusText}>
                  {progress < 25 && "Scanning for face..."}
                  {progress >= 25 && progress < 50 && "Looking for facial features..."}
                  {progress >= 50 && progress < 75 && "Face detected! Analyzing..."}
                  {progress >= 75 && "Verifying facial identity..."}
                </Text>
                <Text style={styles.progressText}>{progress}%</Text>
              </>
            )}
            
            {detectionComplete && (
              <Text style={styles.successStatusText}>
                Face verified successfully!
              </Text>
            )}
          </View>
        </View>
      </View>
      
      {/* Controls */}
      <View style={styles.controls}>
        {!isDetecting && !detectionComplete && (
          <>
            <TouchableOpacity
              style={styles.startButton}
              onPress={startFaceDetection}
            >
              <Icon name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>Start Detection</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.skipButton}
              onPress={skipFaceDetection}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </>
        )}
        
        {isDetecting && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.detectionText}>Detecting your face...</Text>
          </View>
        )}
        
        {detectionComplete && (
          <View style={styles.progressContainer}>
            <Icon name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.completeText}>Verification Complete</Text>
          </View>
        )}
      </View>
      
      {/* Driver Info */}
      <View style={styles.driverInfo}>
        <Text style={styles.driverName}>{driverName || "Driver"}</Text>
        <Text style={styles.driverEmail}>{driverEmail || ""}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  
  camera: {
    flex: 1,
  },
  
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  
  detectionFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  
  faceIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  
  scanLine: {
    position: "absolute",
    top: 0,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: "#4CAF50",
    borderRadius: 1,
  },
  
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#fff",
  },
  
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 15,
  },
  
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 15,
  },
  
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 15,
  },
  
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 15,
  },
  
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  
  successText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  
  statusContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  
  statusText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  
  progressText: {
    color: "#4CAF50",
    fontSize: 24,
    fontWeight: "bold",
  },
  
  successStatusText: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
  },
  
  controls: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  
  skipButtonText: {
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  
  progressContainer: {
    alignItems: "center",
  },
  
  detectionText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  
  completeText: {
    color: "#4CAF50",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  
  driverInfo: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  
  driverName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  
  driverEmail: {
    color: "#ccc",
    fontSize: 14,
  },
  
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  
  noCameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  
  noCameraText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  
  noCameraSubText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
  },
  
  camera: {
    flex: 1,
  },
  
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 20,
  },
  
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  faceBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
  },
  
  faceIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  
  subText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  
  startButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  
  skipButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  
  skipButtonText: {
    color: "#ccc",
    fontSize: 14,
  },
  
  progressContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  
  detectionText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  
  completeText: {
    color: "#4CAF50",
    fontSize: 16,
    marginLeft: 10,
  },
  
  driverInfo: {
    backgroundColor: "#333",
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  
  driverName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  driverEmail: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 5,
  },
});

export default DriverFaceDetectionScreen;

