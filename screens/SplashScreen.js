import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

export default function SplashScreen({ navigation }) {
  const reveal = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // reveal animation
    Animated.timing(reveal, {
      toValue: 1,
      duration: 1600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    setTimeout(() => {
      navigation.replace("Home");
    }, 3500);
  }, []);

  const scale = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const opacity = reveal;

  return (
    <View style={styles.container}>
      {/* glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glow,
            transform: [{ scale: glow.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.6],
            }) }],
          },
        ]}
      />

      {/* logo */}
      <Animated.View
        style={{
          opacity,
          transform: [{ scale }],
          alignItems: "center",
        }}
      >
        <Text style={styles.logo}>EduFleet</Text>
        <View style={styles.line} />
        <Text style={styles.tag}>Smart Mobility Platform</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b5a1a1ff",
    justifyContent: "center",
    alignItems: "center",
  },

  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  logo: {
    fontSize: 44,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1.5,
  },

  line: {
    width: 80,
    height: 2,
    backgroundColor: "#ffffff",
    marginVertical: 12,
    opacity: 0.7,
  },

  tag: {
    fontSize: 14,
    color: "#cccccc",
    letterSpacing: 1,
  },
});
