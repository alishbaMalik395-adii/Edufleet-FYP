import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, SafeAreaView,
  Animated, Easing, Dimensions,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import FaceDetection from '@react-native-ml-kit/face-detection';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const BACKEND_URL = 'http://10.49.78.126:5000';
const { width, height } = Dimensions.get('window');

export default function DriverFaceDetectionScreen({ navigation, route }) {
  const { driverId, driverEmail, driverName } = route.params || {};
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');
  const cameraRef = useRef(null);
  const photoOutput = usePhotoOutput();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Press button to scan face');
  const [faceDetected, setFaceDetected] = useState(false);

  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 800, useNativeDriver: true,
    }).start();

    // Scan line loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1, duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0, duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05, duration: 1200, useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.98, duration: 1200, useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate loop
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1, duration: 6000,
        easing: Easing.linear, useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const CIRCLE_SIZE = width * 0.75;

  React.useEffect(() => {
    if (!hasPermission) requestPermission();
  }, []);

  const onScanPress = async () => {
    try {
      setIsProcessing(true);
      setFaceDetected(false);
      setStatusMsg('📸 Capturing...');

      const result = await photoOutput.capturePhotoToFile(
        cameraRef.current,
        {}
      );

      // Log to see exact structure
      console.log('Photo result:', JSON.stringify(result));

      // Handle different possible return formats
      let filePath = null;
      if (typeof result === 'string') {
        filePath = result;
      } else if (result && result.filePath) {
        filePath = result.filePath;
      } else if (result && result.path) {
        filePath = result.path;
      } else if (result && result.uri) {
        filePath = result.uri;
      } else {
        throw new Error('Unknown photo format: ' + JSON.stringify(result));
      }

      const fileUri = filePath.startsWith('file://')
        ? filePath
        : 'file://' + filePath;

      setStatusMsg('🔍 Detecting face...');
      const faces = await FaceDetection.detect(fileUri);

      if (!faces || faces.length === 0) {
        setStatusMsg('No face found. Try again.');
        Alert.alert('No Face Detected', 'Please look directly at camera.');
        return;
      }

      setFaceDetected(true);
      setStatusMsg('⚡ Optimizing...');

      // Compress image before upload
      const compressed = await ImageResizer.createResizedImage(
        fileUri,
        640,
        480,
        'JPEG',
        60,
        0
      );

      setStatusMsg('☁️ Verifying identity...');

      const formData = new FormData();
      formData.append('driverImage', {
        uri: compressed.uri,
        type: 'image/jpeg',
        name: 'driver_' + Date.now() + '.jpg',
      });
      formData.append('driverId', String(driverId || 'unknown'));

      const response = await fetch(BACKEND_URL + '/api/driver/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      const result2 = await response.json();

      if (response.ok && result2.success) {
        
        if (result2.isFirstTime) {
          // First time - face registered
          setStatusMsg('✅ Face Registered!');
          Alert.alert(
            '✅ Face Registered!', 
            'Your face has been saved successfully. You can now login with face verification.',
            [{ 
              text: 'Continue', 
              onPress: () => navigation.navigate('DriverLoginSuccess', {
                driverId: driverId,
                driverEmail: driverEmail,
                driverName: driverName,
                faceVerified: true,
              })
            }]
          );
        } else {
          // Second time - face matched
          const confidence = result2.data?.confidence || '';
          setStatusMsg('✅ Face Verified!');
          Alert.alert(
            '✅ Identity Confirmed!',
            'Welcome back! Face matched successfully.',
            [{
              text: 'Continue',
              onPress: () => navigation.navigate('DriverLoginSuccess', {
                driverId: driverId,
                driverEmail: driverEmail,
                driverName: driverName,
                faceVerified: true,
              })
            }]
          );
        }

      } else {
        // Face did not match or error
        setStatusMsg('❌ ' + (result2.message || 'Verification failed'));
        
        if (response.status === 401) {
          Alert.alert(
            '❌ Access Denied',
            'Your face does not match the registered face for this account. Please try again or contact support.',
            [{ text: 'Try Again', onPress: () => setStatusMsg('Press button to scan face') }]
          );
        } else {
          Alert.alert(
            'Verification Failed',
            result2.message || 'Please try again.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (err) {
      console.error('Camera error:', err);
      setStatusMsg('Error: ' + err.message);
      Alert.alert('Camera Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.whiteText}>Camera permission needed</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text style={styles.whiteText}>No camera found</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      
      {/* Dark overlay */}
      <View style={styles.overlay} />

      {/* Top section */}
      <View style={styles.topSection}>
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>🔐  IDENTITY VERIFICATION</Text>
        </View>
        <Text style={styles.title}>Face Verification</Text>
        <Text style={styles.subtitle}>
          Center your face in the circle
        </Text>
      </View>

      {/* Middle - Circle camera area */}
      <View style={styles.middleSection}>

        {/* Rotating dashed ring */}
        <Animated.View style={[
          styles.rotatingRing,
          { transform: [{ rotate: spin }] }
        ]} />

        {/* Pulse ring */}
        <Animated.View style={[
          styles.pulseRing,
          faceDetected ? styles.pulseRingGreen : styles.pulseRingBlue,
          { transform: [{ scale: pulseAnim }] }
        ]} />

        {/* Circle clip for camera */}
        <View style={[styles.circleClip, { width: CIRCLE_SIZE, height: CIRCLE_SIZE }]}>
          <Camera
            ref={cameraRef}
            style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
            device={device}
            isActive={true}
            outputs={[photoOutput]}
          />

          {/* Scan line inside circle */}
          <Animated.View style={[
            styles.scanLine,
            {
              transform: [{
                translateY: scanAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-CIRCLE_SIZE / 2, CIRCLE_SIZE / 2],
                })
              }]
            }
          ]} />

          {/* Face detected green overlay */}
          {faceDetected && (
            <View style={styles.faceFoundOverlay} />
          )}
        </View>

        {/* 4 corner dots */}
        <View style={[styles.cornerDot, styles.dotTL]} />
        <View style={[styles.cornerDot, styles.dotTR]} />
        <View style={[styles.cornerDot, styles.dotBL]} />
        <View style={[styles.cornerDot, styles.dotBR]} />

        {/* Status pill */}
        <View style={[
          styles.statusPill,
          faceDetected ? styles.pillGreen : styles.pillDark
        ]}>
          <Animated.View style={[
            styles.statusDot,
            faceDetected ? styles.dotGreen : styles.dotGray,
            { transform: [{ scale: pulseAnim }] }
          ]} />
          <Text style={styles.statusText}>{statusMsg}</Text>
        </View>
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>

        {/* Scan button */}
        <TouchableOpacity
          style={[styles.scanBtn, isProcessing && styles.scanBtnDisabled]}
          onPress={onScanPress}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <View style={styles.btnRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.btnText}>  Analyzing...</Text>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <Text style={styles.btnIcon}>📸</Text>
              <Text style={styles.btnText}>  Scan & Verify</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          🔒  Secured • End-to-end encrypted
        </Text>
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  topBadge: {
    backgroundColor: 'rgba(33,150,243,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(33,150,243,0.5)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 12,
  },
  topBadgeText: {
    color: '#64B5F6',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
    textShadowColor: 'rgba(33,150,243,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
  middleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    position: 'relative',
  },
  rotatingRing: {
    position: 'absolute',
    width: width * 0.82,
    height: width * 0.82,
    borderRadius: width * 0.41,
    borderWidth: 1.5,
    borderColor: 'rgba(33,150,243,0.4)',
    borderStyle: 'dashed',
  },
  pulseRing: {
    position: 'absolute',
    width: width * 0.79,
    height: width * 0.79,
    borderRadius: width * 0.395,
    borderWidth: 2,
  },
  pulseRingBlue: {
    borderColor: 'rgba(33,150,243,0.7)',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 15,
  },
  pulseRingGreen: {
    borderColor: '#00E676',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  circleClip: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(33,150,243,0.8)',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 5,
  },
  faceFoundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,230,118,0.12)',
    zIndex: 4,
  },
  cornerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  dotTL: { top: '18%', left: '13%' },
  dotTR: { top: '18%', right: '13%' },
  dotBL: { bottom: '18%', left: '13%' },
  dotBR: { bottom: '18%', right: '13%' },
  statusPill: {
    position: 'absolute',
    bottom: -20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 8,
    borderWidth: 1,
  },
  pillDark: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pillGreen: {
    backgroundColor: 'rgba(0,230,118,0.15)',
    borderColor: '#00E676',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotGray: { backgroundColor: '#546E7A' },
  dotGreen: { backgroundColor: '#00E676' },
  statusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 40,
    zIndex: 10,
  },
  scanBtn: {
    backgroundColor: '#1565C0',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 1,
    borderColor: 'rgba(33,150,243,0.3)',
  },
  scanBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    shadowOpacity: 0,
    elevation: 0,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnIcon: { fontSize: 22 },
  btnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  whiteText: { color: '#fff', marginBottom: 10 },
  btn: { backgroundColor: '#2196F3', padding: 10, borderRadius: 8 },
  btnText: { color: '#fff' },
});

