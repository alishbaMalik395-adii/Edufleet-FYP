import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export default function PaymentSuccessScreen({ navigation, route }) {

  const method = route.params?.method || "Unknown";

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        
        <Text style={styles.title}>Payment Successful 🎉</Text>
        <Text style={styles.subtitle}>Your transaction was completed</Text>

        <View style={styles.card}>
          
          <Icon name="checkmark-circle-outline" size={90} color="#4CAF50" />

          <Text style={styles.successText}>Payment Received</Text>

          <Text style={styles.amount}>Rs 3,500</Text>

          <Text style={styles.detail}>Transaction ID: TXN-8923471</Text>
          <Text style={styles.detail}>Method: {method}</Text>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("UserDashboard")}
          >
            <Text style={styles.btnText}>Go to Dashboard</Text>
          </TouchableOpacity>

        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  container: { paddingTop: 80, paddingHorizontal: 22 },

  title: { fontSize: 32, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 17, marginTop: 6, color: '#eaeaea' },

  card: {
    marginTop: 40,
    width: '100%',
    borderRadius: 25,
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.66)',
    elevation: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  successText: { marginTop: 15, fontSize: 26, fontWeight: '700', color: '#fff' },
  amount: { fontSize: 30, fontWeight: '800', color: '#fff', marginTop: 10, marginBottom: 10 },

  detail: { fontSize: 14, color: '#ddd', marginTop: 2 },

  btn: {
    marginTop: 25,
    backgroundColor: '#ffffffcc',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  btnText: { fontSize: 18, fontWeight: '700', color: '#000' },
});
