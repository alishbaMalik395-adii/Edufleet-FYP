// HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import driverIcon from '../assets/driver.jpg';
import adminIcon from '../assets/admin.jpg';
import userIcon from '../assets/user.jpg';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        
        <Text style={styles.subtitle}>Login as</Text>

        <View style={styles.iconContainer}>
          {/* Admin */}
          <TouchableOpacity
            style={styles.iconBox}
            onPress={() => navigation.navigate('AdminLogin')}
          >
            <Image source={adminIcon} style={styles.icon} />
            <Text style={styles.label}>Admin</Text>
          </TouchableOpacity>

          {/* Driver */}
          <TouchableOpacity
            style={styles.iconBox}
            onPress={() => navigation.navigate('DriverLogin')}
          >
            <Image source={driverIcon} style={styles.icon} />
            <Text style={styles.label}>Driver</Text>
          </TouchableOpacity>

          {/* User */}
          <TouchableOpacity
            style={styles.iconBox}
            onPress={() => navigation.navigate('UserLogin')}
          >
            <Image source={userIcon} style={styles.icon} />
            <Text style={styles.label}>User</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.59)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0078D7',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 25,
    color: '#555',
    marginBottom: 78,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  iconBox: {
    alignItems: 'center',
  },
  icon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#0078D7',
    fontWeight: 'bold',
  },
});

export default HomeScreen;