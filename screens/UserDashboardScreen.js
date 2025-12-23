// UserDashboardScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const UserDashboardScreen = ({ navigation, route }) => {
  const userEmail = route?.params?.userEmail;

  return (
    <ImageBackground
      source={require('../assets/background.jpg')} // 
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>

        {/* HEADER */}
        <Text style={styles.title}>Welcome Back </Text>
        <Text style={styles.subtitle}>Your smart transport dashboard</Text>

        {/* GLASS CARDS */}
        <View style={styles.grid}>

          <GlassCard
            title="Challan"
            icon="document-text-outline"
            desc="View & Download"
            onPress={() => navigation.navigate("Challan")}
          />

          <GlassCard
            title="Payments"
            icon="card-outline"
            desc="Online Payments"
            onPress={() => navigation.navigate("PaymentScreen")}
          />

          <GlassCard
            title="Tracking"
            icon="navigate-outline"
            desc="Live Bus Location"
            onPress={() => navigation.navigate("TrackingScreen")}
          />

          <GlassCard
            title="Messages"
            icon="chatbubble-ellipses-outline"
            desc="Admin Alerts"
            onPress={() => navigation.navigate("MessagesScreen")}
          />

          <GlassCard
            title="Complaints"
            icon="alert-circle-outline"
            desc="Submit Issue"
            onPress={() => navigation.navigate("ComplaintScreen")}
          />

          <GlassCard
            title="Profile"
            icon="person-outline"
            desc="View Details"
            //onPress={() => navigation.navigate("ProfileScreen")}
            //onPress={() => navigation.navigate("UserProfileScreen")}
            onPress={() =>
  navigation.navigate("UserProfileScreen", {
    userEmail: userEmail,
  })
}


          />

        </View>
      </View>

    </ImageBackground>
  );
};

const GlassCard = ({ title, desc, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Icon name={icon} size={42} color="#fff" style={{ marginBottom: 10 }} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDesc}>{desc}</Text>
  </TouchableOpacity>
  
  
);

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  container: {
    paddingTop: 80,
    paddingHorizontal: 22,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },

  subtitle: {
    fontSize: 17,
    marginTop: 6,
    color: '#e8e8e8',
  },

  grid: {
    marginTop: 35,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "47%",
    height: 160,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,

    /** GLASS EFFECT */
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.66)',
    backdropFilter: "blur(10px)", // iOS only

    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffffff',
  },

  cardDesc: {
    marginTop: 4,
    fontSize: 13,
    color: '#ddd',
  },
});

export default UserDashboardScreen;