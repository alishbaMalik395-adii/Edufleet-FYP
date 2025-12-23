import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function DownloadChallan() {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.heading}>Download Challan</Text>
        <Text style={styles.subHeading}>Press the button below to download your challan</Text>

        {/* DOWNLOAD BUTTON (Frontend only for now) */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("Download feature will work after backend is added")}
        >
          <Icon name="cloud-download-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Download PDF</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  container: {
    paddingTop: 100,
    paddingHorizontal: 25,
  },

  heading: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "800",
  },

  subHeading: {
    fontSize: 16,
    color: "#e6e6e6",
    marginTop: 5,
    marginBottom: 40,
  },

  button: {
    marginTop: 20,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.45)",
    elevation: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
