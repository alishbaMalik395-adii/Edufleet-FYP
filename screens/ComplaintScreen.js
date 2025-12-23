import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

export default function ComplaintScreen({ navigation }) {

  const [rollNo, setRollNo] = useState("");
  const [issueType, setIssueType] = useState("Bus Late");
  const [description, setDescription] = useState("");

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Complaints 📝</Text>
        <Text style={styles.subtitle}>Submit your issue</Text>

        <View style={styles.card}>

          {/* ROLL NO */}
          <Text style={styles.label}>Roll No</Text>
          <TextInput
            style={styles.inputSmall}
            placeholder="Enter Roll Number"
            placeholderTextColor="#ccc"
            value={rollNo}
            onChangeText={setRollNo}
          />

          {/* ISSUE TYPE */}
          <Text style={styles.label}>Select Issue</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={issueType}
              onValueChange={(value) => setIssueType(value)}
            >
              <Picker.Item label="Bus Late" value="Bus Late" />
              <Picker.Item label="Driver Misbehaviour" value="Driver Misbehaviour" />
              <Picker.Item label="Over Speeding" value="Over Speeding" />
              <Picker.Item label="System Issue" value="System Issue" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.label}>Describe Issue</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Write your complaint here..."
            placeholderTextColor="#ccc"
            value={description}
            onChangeText={setDescription}
          />

          {/* SUBMIT */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() =>
              navigation.navigate("ComplaintSuccess", {
                rollNo,
                issueType,
                description,
              })
            }
          >
            <Text style={styles.submitText}>Submit</Text>
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
    borderColor: "rgba(255,255,255,0.66)",
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginTop: 12,
  },
  inputSmall: {
    backgroundColor: "#ffffffcc",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    color: "#000",
  },
  dropdown: {
    backgroundColor: "#ffffffcc",
    borderRadius: 12,
    marginTop: 6,
  },
  input: {
    backgroundColor: "#ffffffcc",
    height: 120,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    color: "#000",
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
});
