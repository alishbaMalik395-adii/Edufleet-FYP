import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration, Alert } from 'react-native';
import io from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.90:5000';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Load unread count from storage on mount
  useEffect(() => {
    loadUnreadCount();
    initializeSocket();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await AsyncStorage.getItem('unreadNotifications');
      if (count) {
        setUnreadCount(parseInt(count));
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const initializeSocket = async () => {
    try {
      // Get driver ID from AsyncStorage
      const driverData = await AsyncStorage.getItem('driverData');
      const driverId = driverData ? JSON.parse(driverData).id : 'driver_1';

      // Initialize socket connection
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true,
      });

      newSocket.on('connect', () => {
        console.log('Connected to notification server:', newSocket.id);
        setIsConnected(true);
        
        // Register this driver
        newSocket.emit('register_driver', driverId);
        console.log('Registered driver:', driverId);
      });

      // Listen for new notifications
      newSocket.on('notification', (notification) => {
        console.log('New notification received:', notification);
        
        // Vibrate the device (WhatsApp-like)
        Vibration.vibrate([0, 500, 200, 500]);
        
        // Show alert
        Alert.alert(
          notification.title,
          notification.message,
          [{ text: 'OK', style: 'default' }]
        );

        // Add to notifications list
        setNotifications(prev => [
          { ...notification, id: Date.now().toString(), time: 'Just now' },
          ...prev.slice(0, 9)
        ]);

        // Increment unread count
        setUnreadCount(prev => prev + 1);
        
        // Save to storage
        saveUnreadCount(prev => prev + 1);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from notification server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.log('Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

    } catch (error) {
      console.error('Socket initialization error:', error);
    }
  };

  const saveUnreadCount = async (count) => {
    try {
      await AsyncStorage.setItem('unreadNotifications', count.toString());
    } catch (error) {
      console.error('Error saving unread count:', error);
    }
  };

  const clearUnreadNotifications = () => {
    setUnreadCount(0);
    saveUnreadCount(0);
  };

  const getConnectionStatus = () => {
    return isConnected;
  };

  const value = {
    unreadCount,
    notifications,
    isConnected,
    clearUnreadNotifications,
    getConnectionStatus,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
