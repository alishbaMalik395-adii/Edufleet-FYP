import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ChallanScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        
        {/* Heading */}
        <Text style={styles.heading}>Challan Options</Text>
        <Text style={styles.subHeading}>View or Download your challan</Text>

        {/* VIEW BUTTON */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate("ViewChallan")}   // ⭐ Navigation added
        >
          <Icon name="eye-outline" size={28} color="#fff" />
          <Text style={styles.buttonText}>View Challan</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate("DownloadChallan")}
>
  <Icon name="download-outline" size={28} color="#fff" />
  <Text style={styles.buttonText}>Download Challan</Text>
</TouchableOpacity>


        

        {/* BACK BUTTON */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={24} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  container: {
    paddingTop: 90,
    paddingHorizontal: 25,
  },

  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },

  subHeading: {
    color: "#e6e6e6",
    marginTop: 5,
    fontSize: 16,
  },

  button: {
    marginTop: 30,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    elevation: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  backBtn: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  backText: {
    color: "#fff",
    fontSize: 16,
  },
});
