// AdminLoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';



const AdminLoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // ✅ initialize navigation

  const handleLogin = () => {
    if (username === 'admin' && password === '12345') {
      Alert.alert('✅ Login Successful', 'Welcome back, Admin!');
    } else {
      Alert.alert('❌ Login Failed', 'Invalid username or password');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')} // ✅ same as HomeScreen
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.loginBox}>
          <Text style={styles.title}>Admin Login</Text>
          <Text style={styles.subtitle}>Access your control panel</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Username"
            placeholderTextColor="#777"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')} // ✅ navigate to Home
          >
            <Text style={styles.backText}> Back to Home</Text>
          </TouchableOpacity>

          
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginBox: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0078D7',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#0078D7',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    shadowColor: '#0078D7',
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0078D7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#0078D7',
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  backButton: {
    marginTop: 20,
  },
  backText: {
    color: '#0078D7',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminLoginScreen;
