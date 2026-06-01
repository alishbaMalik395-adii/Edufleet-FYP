import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ImageBackground, SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ChallanScreen({ navigation, route }) {
  const { userEmail, regNo, userName, busId, studentId } = route.params || {};

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Challan</Text>
        <Text style={styles.subtitle}>View or download your fee challan</Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ViewChallan', {
              userEmail, regNo, userName, busId, studentId
            })}
          >
            <Icon name="document-text-outline" size={40} color="#2196F3" />
            <Text style={styles.cardTitle}>View Challan</Text>
            <Text style={styles.cardDesc}>View your fee challan details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DownloadChallan', {
              userEmail, regNo, userName, busId, studentId
            })}
          >
            <Icon name="download-outline" size={40} color="#4CAF50" />
            <Text style={styles.cardTitle}>Download Challan</Text>
            <Text style={styles.cardDesc}>Download PDF of your challan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: { flex: 1, paddingHorizontal: 20 },
  backBtn: { marginTop: 20, marginBottom: 10 },
  title: {
    color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 8,
  },
  subtitle: { color: '#ddd', fontSize: 15, marginBottom: 40 },
  cardContainer: { gap: 20 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    padding: 30,
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    color: '#fff', fontSize: 20, fontWeight: '700',
  },
  cardDesc: { color: '#ddd', fontSize: 13, textAlign: 'center' },
});
