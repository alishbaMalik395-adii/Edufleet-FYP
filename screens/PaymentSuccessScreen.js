import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function PaymentSuccessScreen({ navigation, route }) {
  const { method, amount, month, txnId, userEmail, regNo, userName, busId } = route.params || {};

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
          <View style={styles.iconCircle}>
            <Icon name="checkmark-circle" size={80} color="#4CAF50" />
          </View>

          <Text style={styles.successText}>Payment Received</Text>
          <Text style={styles.amount}>Rs {amount?.toLocaleString() || '0'}</Text>

          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Month</Text>
              <Text style={styles.detailValue}>{month || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Method</Text>
              <Text style={styles.detailValue}>{method}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>{txnId || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.detailValue, { color: '#4CAF50' }]}>✅ Paid</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('UserDashboard', {
              userEmail, regNo, userName, busId
            })}
          >
            <Text style={styles.btnText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  container: { flex: 1, paddingTop: 70, paddingHorizontal: 22 },
  title: { fontSize: 30, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 16, marginTop: 6, color: '#eaeaea', marginBottom: 30 },
  card: {
    width: '100%', borderRadius: 25, padding: 25,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
  },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(76,175,80,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  successText: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 },
  amount: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 20 },
  detailsBox: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16, padding: 16, marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  detailLabel: { color: '#ddd', fontSize: 14 },
  detailValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  btn: {
    backgroundColor: '#ffffffcc', paddingVertical: 14,
    paddingHorizontal: 50, borderRadius: 30,
  },
  btnText: { fontSize: 18, fontWeight: '700', color: '#000' },
});
