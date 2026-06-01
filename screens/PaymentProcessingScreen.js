import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, ImageBackground,
} from 'react-native';

const BACKEND_URL = 'http://10.49.78.126:5000';

export default function PaymentProcessingScreen({ navigation, route }) {
  const { method, challanId, amount, month, userEmail, regNo, userName, busId } = route.params || {};
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    processPayment();
  }, []);

  const processPayment = async () => {
    try {
      setStatus('Connecting to payment gateway...');
      await new Promise(r => setTimeout(r, 1000));
      
      setStatus('Verifying payment...');
      await new Promise(r => setTimeout(r, 1000));

      // Call backend to mark challan as paid
      const response = await fetch(`${BACKEND_URL}/api/challans/${challanId}/pay`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: method }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('Payment confirmed!');
        await new Promise(r => setTimeout(r, 500));
        navigation.replace('PaymentSuccess', {
          method,
          amount,
          month,
          txnId: result.txnId,
          userEmail, regNo, userName, busId,
        });
      } else {
        setStatus('Payment failed. Please try again.');
        await new Promise(r => setTimeout(r, 2000));
        navigation.goBack();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setStatus('Network error. Please try again.');
      await new Promise(r => setTimeout(r, 2000));
      navigation.goBack();
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>{status}</Text>
        <Text style={styles.sub}>Method: {method}</Text>
        {amount && (
          <Text style={styles.amount}>Rs {amount?.toLocaleString()}</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  text: { color: '#fff', fontSize: 22, marginTop: 20, fontWeight: '700', textAlign: 'center' },
  sub: { color: '#ddd', fontSize: 16, marginTop: 8 },
  amount: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 12 },
});

