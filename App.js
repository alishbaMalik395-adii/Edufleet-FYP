import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ===== SCREENS =====
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import DriverLoginScreen from './screens/DriverLoginScreen';
import UserLoginScreen from './screens/UserLoginScreen';

import DriverDashboard from './screens/DriverDashboard';
import UserDashboardScreen from './screens/UserDashboardScreen';

import BusSelectionScreen from './screens/BusSelectionScreen';
import DriverLiveMapScreen from './screens/DriverLiveMapScreen';

// USER FLOW SCREENS
import ChallanScreen from './screens/ChallanScreen';
import ViewChallanScreen from './screens/ViewChallanScreen';
import DownloadChallan from './screens/DownloadChallan';

import PaymentScreen from './screens/PaymentScreen';
import PaymentProcessingScreen from './screens/PaymentProcessingScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';

import TrackingScreen from './screens/TrackingScreen';
import MessagesScreen from './screens/MessagesScreen';
import ComplaintScreen from './screens/ComplaintScreen';
import ComplaintSuccessScreen from './screens/ComplaintSuccessScreen';
import UserProfileScreen from './screens/UserProfileScreen';

// ===== CONTEXT =====
import { RideProvider } from './context/RideContext';

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
          <Stack.Screen name="BusSelectionScreen" component={BusSelectionScreen} />
          <Stack.Screen name="DriverLiveMap" component={DriverLiveMapScreen} />

          {/* USER FLOW */}
          <Stack.Screen name="Challan" component={ChallanScreen} />
          <Stack.Screen name="ViewChallan" component={ViewChallanScreen} />
          <Stack.Screen name="DownloadChallan" component={DownloadChallan} />

          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="PaymentProcessing" component={PaymentProcessingScreen} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />

          <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
          <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
          <Stack.Screen name="ComplaintScreen" component={ComplaintScreen} />
          <Stack.Screen name="ComplaintSuccess" component={ComplaintSuccessScreen} />
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </RideProvider>
  );
}
