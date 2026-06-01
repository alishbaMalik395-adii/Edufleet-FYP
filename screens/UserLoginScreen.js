// Screens/UserLoginScreen.js
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "http://10.49.78.126:5000/api";

const UserLoginScreen = ({ navigation, route }) => {
  const { showBusScreen, userEmail: paramEmail, userName: paramName,
          busId: paramBusId, studentId: paramStudentId,
          regNo: paramRegNo } = route.params || {};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regNo, setRegNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [assignedBus, setAssignedBus] = useState('');
  const [studentData, setStudentData] = useState(null);

  const handleLogin = async () => {
    // BASIC VALIDATION
    if (!email || !regNo) {
      Alert.alert('⚠️ Missing Fields', 'Please enter email and registration number');
      return;
    }

    if (!email.includes('@gmail.com')) {
      Alert.alert('❌ Invalid Email', 'Please use a valid Gmail address');
      return;
    }

    setIsLoading(true);

    try {
      // Backend validation for student login (busId will come from database)
      const response = await axios.post(`${API_BASE_URL}/students/login`, {
        email: email.trim(),
        reg: regNo.trim().toUpperCase()
      });

      if (response.status === 200) {
        const student = response.data.student;
        setStudentData(student);
        const bus = student.busNo || assignedBus;
        setAssignedBus(bus);
        Alert.alert('✅ Login Successful', `Welcome ${student.name}!`);
        await AsyncStorage.setItem('userData', JSON.stringify({
          id: student.id,
          name: student.name,
          email: email,
          busId: bus,
          regNo: regNo,
        }));
        navigation.navigate('StudentFaceDetection', {
          userEmail: email,
          regNo: regNo,
          userName: student.name,
          busId: bus,
          studentId: student.id,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert('❌ Login Failed', 'Student not found. Only admin-added students can login.');
        } else if (error.response.status === 400) {
          Alert.alert('❌ Invalid Data', 'Please check your email and registration number');
        } else {
          Alert.alert('❌ Error', 'Login failed. Please try again.');
        }
      } else {
        Alert.alert('❌ Network Error', 'Could not connect to server. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToDashboard = () => {
    const busToUse = paramBusId || assignedBus;
    if (!busToUse) {
      Alert.alert("⚠️ No Bus Assigned", "Please contact admin for bus assignment");
      return;
    }

    navigation.navigate('UserDashboard', {
      userEmail: paramEmail || email,
      regNo: paramRegNo || regNo,
      userName: paramName || studentData?.name,
      busId: busToUse,
      studentId: paramStudentId || studentData?.id,
      faceVerified: true,
    });
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>User Login</Text>
        <Text style={styles.subtitle}>Login using your Gmail</Text>

        {!loginSuccess && !showBusScreen ? (
          <>
            {/* EMAIL */}
            <TextInput
              style={styles.input}
              placeholder="Enter Gmail"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />

            {/* REGISTRATION NUMBER */}
            <TextInput
              style={styles.input}
              placeholder="Reg no(F21-BCS-M23)"
              placeholderTextColor="#999"
              value={regNo}
              onChangeText={setRegNo}
              autoCapitalize="characters"
              editable={!isLoading}
            />

            {/* LOGIN */}
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
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
              {(paramBusId || assignedBus) ? (
                <View style={styles.busDisplay}>
                  <Icon name="bus-outline" size={32} color="#2C3E50" />
                  <Text style={styles.assignedBusText}>{paramBusId || assignedBus}</Text>
                </View>
              ) : (
                <Text style={styles.noBusText}>No bus assigned</Text>
              )}
            </View>

            {/* CONTINUE TO DASHBOARD BUTTON */}
            <TouchableOpacity 
              style={[styles.button, !(paramBusId || assignedBus) && styles.buttonDisabled]} 
              onPress={handleContinueToDashboard}
              disabled={!(paramBusId || assignedBus)}
            >
              <Text style={styles.buttonText}>Continue to Dashboard</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backText}> Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.49)',
    borderRadius: 25,
    padding: 25,
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2C3E50',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
  },
  backText:{
    color: '#2C3E50',
    fontSize: 16,
    fontWeight:'600'
  },
  pickerWrapper: {
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  marginBottom: 15,
  backgroundColor: '#fff',
},
buttonDisabled: {
  backgroundColor: '#999',
  opacity: 0.6,
},
assignedBusContainer: {
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: 15,
  padding: 20,
  marginBottom: 20,
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#2C3E50',
},
assignedBusTitle: {
  fontSize: 16,
  color: '#2C3E50',
  marginBottom: 10,
  fontWeight: '600',
},
busDisplay: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#ddd',
},
assignedBusText: {
  fontSize: 18,
  fontWeight: '700',
  color: '#2C3E50',
  marginLeft: 10,
},
noBusText: {
  fontSize: 14,
  color: '#e74c3c',
  fontStyle: 'italic',
},

});

export default UserLoginScreen;
