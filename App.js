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
import StartRideScreen from "./screens/StartRideScreen";
import ChallanScreen from "./screens/ChallanScreen";
import DriverNotificationsScreen from "./screens/DriverNotificationsScreen";
import RouteSelectionScreen from "./screens/RouteSelectionScreen";
import ViewChallanScreen from "./screens/ViewChallanScreen";
import RouteInformationScreen from "./screens/RouteInformationScreen";
import DownloadChallan from "./screens/DownloadChallan";
import PaymentScreen from "./screens/PaymentScreen";
import PaymentProcessingScreen from "./screens/PaymentProcessingScreen";
import PaymentSuccessScreen from "./screens/PaymentSuccessScreen";
import TrackingScreen from "./screens/TrackingScreen";
import ComplaintScreen from "./screens/ComplaintScreen";
import ComplaintSuccessScreen from "./screens/ComplaintSuccessScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
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
          
          <Stack.Screen name="Challan" component={ChallanScreen} />

          {/* DASHBOARDS */}
          <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
          <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
          <Stack.Screen name="StartRideScreen" component={StartRideScreen} />
          <Stack.Screen name="DriverNotifications" component={DriverNotificationsScreen} />
          <Stack.Screen name="RouteSelection" component={RouteSelectionScreen} />
          <Stack.Screen name="RouteInformationScreen" component={RouteInformationScreen} />
          <Stack.Screen name="ViewChallan" component={ViewChallanScreen} />
          <Stack.Screen name="DownloadChallan" component={DownloadChallan} />
          <Stack.Screen name="ComplaintScreen" component={ComplaintScreen} />
          
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
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
          <Stack.Screen name="PaymentProcessing" component={PaymentProcessingScreen} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
          <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
          <Stack.Screen name="ComplaintSuccess" component={ComplaintSuccessScreen} />
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />

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
