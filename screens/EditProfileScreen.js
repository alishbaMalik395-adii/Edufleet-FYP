import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function EditProfileScreen({ navigation, route }) {
  const userEmail = route?.params?.userEmail || "";

  const [name, setName] = useState("Alishba Malik");
  const [rollNo, setRollNo] = useState("21-CS-045");
  const [role, setRole] = useState("Student");

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Edit Profile ✏️</Text>
        <Text style={styles.subtitle}>Update your details</Text>

        <View style={styles.card}>
          {/* NAME */}
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
          />

          {/* ROLL NO */}
          <TextInput
            style={styles.input}
            value={rollNo}
            onChangeText={setRollNo}
            placeholder="Roll No"
          />

          {/* ROLE */}
          <TextInput
            style={styles.input}
            value={role}
            onChangeText={setRole}
            placeholder="Role"
          />

          {/* EMAIL (READ ONLY) */}
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={userEmail}
            editable={false}
          />

          {/* SAVE BUTTON */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="checkmark-circle-outline" size={22} color="#000" />
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  container: {
    paddingTop: 80,
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    fontSize: 17,
    marginTop: 6,
    color: "#eaeaea",
  },
  card: {
    marginTop: 40,
    padding: 25,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.66)",
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 14,
    fontSize: 16,
    marginTop: 12,
    fontWeight: "600",
  },
  disabledInput: {
    backgroundColor: "#e0e0e0",
    color: "#555",
  },
  saveBtn: {
    marginTop: 25,
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: {
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
    color: "#000",
  },
});
