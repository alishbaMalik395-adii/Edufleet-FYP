import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, SafeAreaView, Alert, PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const BACKEND_URL = 'http://10.49.78.126:5000';

export default function DownloadChallan({ navigation, route }) {
  const { userEmail, regNo, userName, busId, studentId } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [challanData, setChallanData] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchLatestChallan();
  }, []);

  const fetchLatestChallan = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/challans/student/email/${encodeURIComponent(userEmail)}` 
      );
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setChallanData(result.data[0]);
      }
    } catch (err) {
      console.log('Error fetching challan:', err);
    } finally {
      setFetching(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setLoading(true);

      if (!challanData) {
        Alert.alert('No Challan', 'No challan found for your account.');
        return;
      }

      const htmlContent = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #1a237e; padding-bottom: 10px; margin-bottom: 20px; }
            .university { font-size: 20px; font-weight: bold; color: #1a237e; }
            .title { font-size: 14px; color: #666; margin-top: 5px; }
            .status { text-align: center; padding: 8px 20px; border-radius: 20px; 
                      display: inline-block; font-weight: bold; margin: 10px auto;
                      background: ${challanData.status === 'Paid' ? '#E8F5E9' : '#FBE9E7'};
                      color: ${challanData.status === 'Paid' ? '#4CAF50' : '#FF5722'}; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            .label { color: #888; width: 40%; }
            .value { font-weight: bold; color: #333; }
            .amount-box { background: #E3F2FD; padding: 15px; border-radius: 10px; 
                          text-align: center; margin-top: 20px; }
            .amount { font-size: 24px; font-weight: bold; color: #1565C0; }
            .bank-box { border: 1px solid #eee; padding: 15px; border-radius: 10px; margin-top: 15px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="university">University of Mianwali</div>
            <div class="title">Transport Fee Challan</div>
          </div>
          
          <div style="text-align:center">
            <span class="status">${challanData.status}</span>
          </div>

          <table>
            <tr><td class="label">Challan No</td><td class="value">CH-${challanData.id}</td></tr>
            <tr><td class="label">Month</td><td class="value">${challanData.month}</td></tr>
            <tr><td class="label">Generated On</td><td class="value">${new Date(challanData.generatedOn).toLocaleDateString()}</td></tr>
          </table>

          <table style="margin-top:15px">
            <tr><td class="label">Student Name</td><td class="value">${challanData.studentName || userName}</td></tr>
            <tr><td class="label">Reg No</td><td class="value">${challanData.reg || regNo}</td></tr>
            <tr><td class="label">Department</td><td class="value">${challanData.dept || 'N/A'}</td></tr>
            <tr><td class="label">Bus No</td><td class="value">${challanData.bus_no || busId}</td></tr>
          </table>

          <div class="amount-box">
            <div style="color:#666; font-size:13px">Total Amount</div>
            <div class="amount">Rs. ${challanData.amount?.toLocaleString()}</div>
          </div>

          <div class="bank-box">
            <div style="font-weight:bold; color:#666; margin-bottom:8px">Bank Details</div>
            <div>The Bank of Punjab</div>
            <div>A/C No: 6510204384600030</div>
          </div>

          <div class="footer">
            Please pay before due date to avoid late fee charges.
          </div>
        </body>
        </html>
      `;

      const options = {
        html: htmlContent,
        fileName: `Challan_${challanData.month}_${regNo || userName}`,
        directory: 'Downloads',
      };

      const pdf = await RNHTMLtoPDF.convert(options);
      Alert.alert(
        '✅ Downloaded!',
        `Challan saved to: ${pdf.filePath}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('PDF error:', error);
      Alert.alert('Error', 'Could not generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Download Challan</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {fetching ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          <>
            <View style={styles.iconContainer}>
              <Icon name="document-text" size={80} color="#2196F3" />
            </View>
            
            <Text style={styles.title}>Download Your Challan</Text>
            <Text style={styles.subtitle}>
              {challanData
                ? `${challanData.month} — Rs. ${challanData.amount?.toLocaleString()}` 
                : 'No challan available'}
            </Text>

            {challanData && (
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>Month: {challanData.month}</Text>
                <Text style={styles.infoText}>Amount: Rs. {challanData.amount?.toLocaleString()}</Text>
                <Text style={[
                  styles.infoText,
                  { color: challanData.status === 'Paid' ? '#4CAF50' : '#FF5722' }
                ]}>
                  Status: {challanData.status}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.downloadBtn, !challanData && styles.btnDisabled]}
              onPress={downloadPDF}
              disabled={loading || !challanData}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="download-outline" size={22} color="#fff" />
                  <Text style={styles.downloadText}>  Download PDF</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  content: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', padding: 24,
  },
  iconContainer: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#E3F2FD',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#333', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 15, marginBottom: 24, textAlign: 'center' },
  infoCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 20, width: '100%', marginBottom: 24,
    elevation: 2, gap: 8,
  },
  infoText: { fontSize: 15, color: '#555', fontWeight: '500' },
  downloadBtn: {
    backgroundColor: '#2196F3', borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 40,
    flexDirection: 'row', alignItems: 'center',
    elevation: 4,
  },
  btnDisabled: { backgroundColor: '#ccc' },
  downloadText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

