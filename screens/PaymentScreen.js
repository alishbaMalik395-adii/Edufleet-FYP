import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ImageBackground, ActivityIndicator, ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BACKEND_URL = 'http://192.168.1.90:5000';

export default function PaymentScreen({ navigation, route }) {
  const { userEmail, regNo, userName, busId, studentId } = route.params || {};
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallan, setSelectedChallan] = useState(null);

  useEffect(() => {
    fetchUnpaidChallans();
  }, []);

  const fetchUnpaidChallans = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/challans/student/email/${encodeURIComponent(userEmail)}` 
      );
      const result = await response.json();
      if (result.success) {
        const unpaid = (result.data || []).filter(c => c.status === 'Unpaid');
        setChallans(unpaid);
        if (unpaid.length > 0) setSelectedChallan(unpaid[0]);
      }
    } catch (err) {
      console.log('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (method) => {
    if (!selectedChallan) return;
    navigation.navigate('PaymentProcessing', {
      method,
      challanId: selectedChallan.id,
      amount: selectedChallan.amount,
      month: selectedChallan.month,
      userEmail, regNo, userName, busId,
    });
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.container}>
        
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Payments 💳</Text>
        <Text style={styles.subtitle}>Pay your transport fee</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
        ) : challans.length === 0 ? (
          <View style={styles.card}>
            <Icon name="checkmark-circle-outline" size={70} color="#4CAF50" />
            <Text style={styles.cardTitle}>All Paid! ✅</Text>
            <Text style={styles.noFeeText}>No pending fee challans found.</Text>
            <TouchableOpacity style={styles.backBtnCard} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Icon name="card-outline" size={60} color="#fff" />
            <Text style={styles.cardTitle}>Fee Due</Text>

            {/* Challan selector if multiple */}
            {challans.length > 1 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 10 }}
                contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}>
                {challans.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.chip,
                      selectedChallan?.id === c.id && styles.chipActive
                    ]}
                    onPress={() => setSelectedChallan(c)}
                  >
                    <Text style={[
                      styles.chipText,
                      selectedChallan?.id === c.id && styles.chipTextActive
                    ]}>
                      {c.month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <Text style={styles.amountLabel}>Amount Due</Text>
            <Text style={styles.amount}>
              Rs {selectedChallan?.amount?.toLocaleString() || '0'}
            </Text>
            <Text style={styles.monthText}>
              Month: {selectedChallan?.month}
            </Text>

            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => handlePayment('Easypaisa')}
            >
              <Icon name="phone-portrait-outline" size={22} color="#000" />
              <Text style={styles.payText}>Pay via Easypaisa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => handlePayment('JazzCash')}
            >
              <Icon name="cash-outline" size={22} color="#000" />
              <Text style={styles.payText}>Pay via JazzCash</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => handlePayment('Credit / Debit Card')}
            >
              <Icon name="card-outline" size={22} color="#000" />
              <Text style={styles.payText}>Credit / Debit Card</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backBtnCard} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  container: { paddingTop: 60, paddingHorizontal: 22, paddingBottom: 40 },
  backBtn: { marginBottom: 10 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 17, marginTop: 6, color: '#eaeaea', marginBottom: 30 },
  card: {
    width: '100%', borderRadius: 25, padding: 25,
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.66)',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 10, marginBottom: 10 },
  noFeeText: { color: '#eee', fontSize: 15, marginTop: 8, textAlign: 'center' },
  amountLabel: { fontSize: 16, color: '#eee', marginTop: 10 },
  amount: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 4 },
  monthText: { color: '#ddd', fontSize: 14, marginBottom: 20 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  chipActive: { backgroundColor: '#fff' },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#333' },
  payBtn: {
    width: '100%', backgroundColor: '#ffffffcc',
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 20,
    borderRadius: 18, marginTop: 12,
  },
  payText: { fontSize: 17, fontWeight: '700', color: '#000', marginLeft: 15 },
  backBtnCard: {
    marginTop: 20, backgroundColor: '#00000066',
    paddingVertical: 12, paddingHorizontal: 40, borderRadius: 30,
  },
  backText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});


