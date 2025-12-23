import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";

export default function ChallanScreen() {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <Text style={styles.title}>University Fee Challan</Text>
        <Text style={styles.subtitle}>Bank of Punjab</Text>

        {/* CHALLAN CARD */}
        <View style={styles.card}>
          <Text style={styles.centerText}>Copy of Depositor</Text>

          <View style={styles.row}><Text style={styles.label}>Challan No:</Text><Text style={styles.value}>CS22-26-7R13</Text></View>
          <View style={styles.row}><Text style={styles.label}>Account No:</Text><Text style={styles.value}>6580204384600052</Text></View>
          <View style={styles.row}><Text style={styles.label}>University:</Text><Text style={styles.value}>University of Mianwali</Text></View>
          <View style={styles.row}><Text style={styles.label}>Department:</Text><Text style={styles.value}>CS & IT</Text></View>

          <View style={styles.divider} />

          <View style={styles.row}><Text style={styles.label}>Name:</Text><Text style={styles.value}>Alishba Malik</Text></View>
          <View style={styles.row}><Text style={styles.label}>Father Name:</Text><Text style={styles.value}>Muhammad Latif</Text></View>
          <View style={styles.row}><Text style={styles.label}>Roll No:</Text><Text style={styles.value}>BCS-F22-M13</Text></View>
          <View style={styles.row}><Text style={styles.label}>Semester:</Text><Text style={styles.value}>7th</Text></View>

          <View style={styles.divider} />

          {/* TABLE HEADER */}
          <View style={styles.tableHeader}>
            <Text style={styles.th}>No</Text>
            <Text style={styles.th}>Particulars</Text>
            <Text style={styles.th}>Amount</Text>
          </View>

          {/* TABLE ROWS */}
          {data.map((item) => (
            <View key={item.no} style={styles.tableRow}>
              <Text style={styles.td}>{item.no}</Text>
              <Text style={styles.td}>{item.title}</Text>
              <Text style={styles.td}>{item.amount}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>24,450</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const data = [
  { no: 1, title: "Tuition Fee", amount: "15,700" },
  { no: 2, title: "Examination Fee", amount: "3,000" },
  { no: 3, title: "Sports Fund", amount: "500" },
  { no: 4, title: "Computer Fund", amount: "1,000" },
  { no: 5, title: "University Other Charges", amount: "3,500" },
  { no: 6, title: "Processing Fee", amount: "50" },
  { no: 7, title: "LMS Charges", amount: "500" },
];

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  container: {
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#eee",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 15,
  },
  centerText: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  label: { fontWeight: "700", color: "#000" },
  value: { color: "#000" },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  th: { fontWeight: "800", width: "33%" },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  td: { width: "33%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  totalText: { fontWeight: "800", fontSize: 16 },
  totalAmount: { fontWeight: "800", fontSize: 16 },
});