import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export default function PaymentScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        
        <Text style={styles.title}>Payments 💳</Text>
        <Text style={styles.subtitle}>Manage your online fees</Text>

        <View style={styles.card}>

          <Icon name="card-outline" size={70} color="#fff" />

          <Text style={styles.cardTitle}>Pay Your Fees</Text>

          <Text style={styles.amountLabel}>Amount Due</Text>
          <Text style={styles.amount}>Rs 3,500</Text>

          {/* Easypaisa */}
          <TouchableOpacity 
            style={styles.payBtn}
            onPress={() => navigation.navigate("PaymentProcessing", { method: "Easypaisa" })}
          >
            <Icon name="phone-portrait-outline" size={22} color="#000" />
            <Text style={styles.payText}>Pay via Easypaisa</Text>
          </TouchableOpacity>

          {/* JazzCash */}
          <TouchableOpacity 
            style={styles.payBtn}
            onPress={() => navigation.navigate("PaymentProcessing", { method: "JazzCash" })}
          >
            <Icon name="cash-outline" size={22} color="#000" />
            <Text style={styles.payText}>Pay via JazzCash</Text>
          </TouchableOpacity>

          {/* Card */}
          <TouchableOpacity 
            style={styles.payBtn}
            onPress={() => navigation.navigate("PaymentProcessing", { method: "Credit / Debit Card" })}
          >
            <Icon name="card-outline" size={22} color="#000" />
            <Text style={styles.payText}>Credit / Debit Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>Go Back</Text>
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

  cardTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 10, marginBottom: 15 },
  amountLabel: { fontSize: 16, color: '#eee' },
  amount: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 20 },

  payBtn: {
    width: '95%',
    backgroundColor: '#ffffffcc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginTop: 12,
  },

  payText: { fontSize: 17, fontWeight: '700', color: '#000', marginLeft: 15 },

  backBtn: {
    marginTop: 25,
    backgroundColor: '#00000066',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  backText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
