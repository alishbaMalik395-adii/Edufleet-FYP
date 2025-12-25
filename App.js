import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// ===== SCREENS =====
import SplashScreen from "./screens/SplashScreen";
import HomeScreen from "./screens/HomeScreen";
import AdminLoginScreen from "./screens/AdminLoginScreen";
import DriverLoginScreen from "./screens/DriverLoginScreen";
import UserLoginScreen from "./screens/UserLoginScreen";

import DriverDashboard from "./screens/DriverDashboard";
import UserDashboardScreen from "./screens/UserDashboardScreen";

import BusSelectionScreen from "./screens/BusSelectionScreen";
import DriverLiveMapScreen from "./screens/DriverLiveMapScreen";

import MessagesScreen from "./screens/MessagesScreen";
import ChatScreen from "./screens/ChatScreen";

import DriverProfileScreen from "./screens/DriverProfileScreen";
import DriverEditProfileScreen from "./screens/DriverEditProfileScreen";

// ===== CONTEXT =====
import { RideProvider } from "./context/RideContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <RideProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          {/* AUTH */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="DriverLogin" component={DriverLoginScreen} />
          <Stack.Screen name="UserLogin" component={UserLoginScreen} />

          {/* DASHBOARDS */}
          <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
          <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />

          {/* DRIVER FLOW */}
          <Stack.Screen
            name="BusSelectionScreen"
            component={BusSelectionScreen}
          />
          <Stack.Screen
            name="DriverLiveMap"
            component={DriverLiveMapScreen}
          />

          {/* CHAT */}
          <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />

          {/* PROFILE */}
          <Stack.Screen
            name="DriverProfile"
            component={DriverProfileScreen}
          />
          <Stack.Screen
            name="DriverEditProfile"
            component={DriverEditProfileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RideProvider>
  );
}
