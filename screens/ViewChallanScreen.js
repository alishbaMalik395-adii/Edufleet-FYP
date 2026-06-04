import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, TouchableOpacity, SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BACKEND_URL = 'http://192.168.1.90:5000';

export default function ViewChallanScreen({ navigation, route }) {
  const { userEmail, regNo, userName, busId, studentId } = route.params || {};
  const [challans, setChallans] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallan, setSelectedChallan] = useState(null);

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/api/challans/student/email/${encodeURIComponent(userEmail)}` 
      );
      const result = await response.json();
      if (result.success) {
        setChallans(result.data || []);
        setStudent(result.student);
        if (result.data && result.data.length > 0) {
          setSelectedChallan(result.data[0]);
        }
      } else {
        setError('Could not fetch challans');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'Paid' ? '#4CAF50' : '#FF5722';
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading challan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Icon name="alert-circle-outline" size={50} color="#FF5722" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchChallans}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (challans.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.centered}>
          <Icon name="document-outline" size={60} color="#ccc" />
          <Text style={styles.noDataText}>No challans found</Text>
          <Text style={styles.noDataSubText}>
            No challans have been generated for your account yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Challans</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Challan selector */}
      {challans.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.selectorRow}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        >
          {challans.map((c, i) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.selectorChip,
                selectedChallan?.id === c.id && styles.selectorChipActive
              ]}
              onPress={() => setSelectedChallan(c)}
            >
              <Text style={[
                styles.selectorText,
                selectedChallan?.id === c.id && styles.selectorTextActive
              ]}>
                {c.month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16 }}>
        {selectedChallan && (
          <View style={styles.challanCard}>
            {/* University Header */}
            <View style={styles.uniHeader}>
              <Text style={styles.uniName}>University of Mianwali</Text>
              <Text style={styles.uniSub}>Transport Fee Challan</Text>
            </View>

            {/* Status Badge */}
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(selectedChallan.status) + '20',
                borderColor: getStatusColor(selectedChallan.status) }
            ]}>
              <View style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(selectedChallan.status) }
              ]} />
              <Text style={[
                styles.statusText,
                { color: getStatusColor(selectedChallan.status) }
              ]}>
                {selectedChallan.status}
              </Text>
            </View>

            {/* Challan Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Challan No</Text>
                <Text style={styles.infoValue}>CH-{selectedChallan.id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Month</Text>
                <Text style={styles.infoValue}>{selectedChallan.month}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Due Date</Text>
                <Text style={styles.infoValue}>
                  {selectedChallan.generatedOn
                    ? new Date(selectedChallan.generatedOn).toLocaleDateString()
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Student Info */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Student Details</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>
                  {selectedChallan.studentName || userName || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Reg No</Text>
                <Text style={styles.infoValue}>
                  {selectedChallan.reg || regNo || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>
                  {selectedChallan.dept || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Bus No</Text>
                <Text style={styles.infoValue}>
                  {selectedChallan.bus_no || busId || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Amount */}
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>Transport Fee</Text>
              <Text style={styles.amountValue}>
                Rs. {selectedChallan.amount?.toLocaleString() || '0'}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>
                Rs. {selectedChallan.amount?.toLocaleString() || '0'}
              </Text>
            </View>

            {/* Bank Details */}
            <View style={styles.bankSection}>
              <Text style={styles.bankTitle}>Bank Details</Text>
              <Text style={styles.bankText}>The Bank of Punjab</Text>
              <Text style={styles.bankText}>A/C No: 6510204384600030</Text>
            </View>

            <Text style={styles.footerNote}>
              Please pay before due date to avoid late fee charges.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  backBtn: { padding: 16 },
  selectorRow: { maxHeight: 60, backgroundColor: '#fff' },
  selectorChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1,
    borderColor: '#ddd', backgroundColor: '#f5f5f5',
    alignSelf: 'center',
  },
  selectorChipActive: {
    backgroundColor: '#2196F3', borderColor: '#2196F3',
  },
  selectorText: { color: '#666', fontSize: 13, fontWeight: '600' },
  selectorTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  challanCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 20, elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8,
  },
  uniHeader: { alignItems: 'center', marginBottom: 16 },
  uniName: { fontSize: 18, fontWeight: '800', color: '#1a237e' },
  uniSub: { fontSize: 13, color: '#666', marginTop: 4 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    alignSelf: 'center', paddingHorizontal: 16,
    paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, marginBottom: 16, gap: 6,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 14, fontWeight: '700' },
  infoSection: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 13, fontWeight: '700',
    color: '#666', marginBottom: 10,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  infoLabel: { color: '#888', fontSize: 14 },
  infoValue: { color: '#333', fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  amountSection: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10,
  },
  amountLabel: { color: '#555', fontSize: 15 },
  amountValue: { color: '#333', fontSize: 15, fontWeight: '600' },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#E3F2FD', padding: 14,
    borderRadius: 10, marginTop: 8,
  },
  totalLabel: { color: '#1565C0', fontSize: 16, fontWeight: '700' },
  totalValue: { color: '#1565C0', fontSize: 18, fontWeight: '800' },
  bankSection: {
    marginTop: 16, padding: 14,
    backgroundColor: '#f9f9f9', borderRadius: 10,
    borderWidth: 1, borderColor: '#eee',
  },
  bankTitle: { fontSize: 13, fontWeight: '700', color: '#666', marginBottom: 6 },
  bankText: { color: '#555', fontSize: 13, marginTop: 2 },
  footerNote: {
    textAlign: 'center', color: '#999',
    fontSize: 12, marginTop: 16, fontStyle: 'italic',
  },
  loadingText: { marginTop: 10, color: '#666' },
  errorText: { color: '#FF5722', marginTop: 10, textAlign: 'center' },
  retryBtn: {
    marginTop: 16, backgroundColor: '#2196F3',
    paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
  noDataText: { fontSize: 18, fontWeight: '700', color: '#333', marginTop: 16 },
  noDataSubText: { color: '#888', textAlign: 'center', marginTop: 8 },
});

