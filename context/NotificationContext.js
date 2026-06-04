import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration, AppState } from 'react-native';
import io from 'socket.io-client';
import notifee, { AndroidImportance } from '@notifee/react-native';

const NotificationContext = createContext();
//const SERVER_URL = 'http://192.168.1.90:5000';
const SERVER_URL = 'http://192.168.1.90:5000';

const ROUTE_MAPPING = {
  '01': 'R1', '1': 'R1',
  '02': 'R2', '2': 'R2',
  '03': 'R3', '3': 'R3',
  '04': 'R4', '4': 'R4',
  '05': 'R5', '5': 'R5',
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userRouteId, setUserRouteId] = useState(null);
  const [socket, setSocket] = useState(null);
  const appState = useRef(AppState.currentState);
  const pollingInterval = useRef(null);

  useEffect(() => {
    setupNotifee();
    loadUnreadCount();
    loadUserRouteId();
    initializeSocket();
    startBackgroundPolling();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  const setupNotifee = async () => {
    await notifee.requestPermission();
    await notifee.createChannel({
      id: 'edufleet_messages',
      name: 'EduFleet Messages',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  };

  const showPushNotification = async (title, body, routeId) => {
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId: 'edufleet_messages',
        importance: AndroidImportance.HIGH,
        pressAction: { id: 'default' },
        smallIcon: 'ic_launcher',
      },
      data: { routeId: routeId || '' },
    });
  };

  const handleAppStateChange = async (nextAppState) => {
    appState.current = nextAppState;
  };

  const startBackgroundPolling = async () => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    pollingInterval.current = setInterval(async () => {
      await checkNewMessages();
    }, 15000);
  };

  const checkNewMessages = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const driverData = await AsyncStorage.getItem('driverData');

      let routeId = null;
      let userName = '';

      if (userData) {
        const user = JSON.parse(userData);
        routeId = ROUTE_MAPPING[String(user.busId).replace('BUS-', '').replace('Bus-', '').trim()] || null;
        userName = user.name || '';
      } else if (driverData) {
        const driver = JSON.parse(driverData);
        routeId = ROUTE_MAPPING[String(driver.busId).replace('BUS-', '').replace('Bus-', '').trim()] || null;
        userName = driver.name || '';
      }

      if (!routeId) return;

      const response = await fetch(`${SERVER_URL}/api/messages/${routeId}`);
      if (!response.ok) return;

      const result = await response.json();
      const messages = result.data || [];
      if (messages.length === 0) return;

      const latestMessage = messages[messages.length - 1];
      const latestId = latestMessage.id;
      const savedLastId = await AsyncStorage.getItem('lastMessageId_' + routeId);

      if (savedLastId && latestId !== savedLastId) {
        const isFromMe = latestMessage.senderName === userName;
        if (!isFromMe) {
          const senderLabel = latestMessage.senderType === 'admin' ? '👨‍💼 Admin' :
            latestMessage.senderType === 'driver' ? '🚌 Driver' : '👤 ' + latestMessage.senderName;

          await showPushNotification(
            'New Message — EduFleet',
            `${senderLabel}: ${latestMessage.message}`,
            routeId
          );

          Vibration.vibrate([0, 300, 100, 300]);
          setUnreadCount(prev => prev + 1);
          saveUnreadCount();
          updateMessageCount(routeId);

          const newNotification = {
            id: Date.now().toString(),
            title: 'New Message',
            message: latestMessage.message,
            routeId: routeId,
            senderType: latestMessage.senderType,
            senderName: latestMessage.senderName,
            time: latestMessage.time,
            isNew: true,
            isAdmin: latestMessage.senderType === 'admin',
          };
          setNotifications(prev => [newNotification, ...prev].slice(0, 50));
        }
      }

      await AsyncStorage.setItem('lastMessageId_' + routeId, latestId);
    } catch (error) {
      console.log('Polling error:', error.message);
    }
  };

  const initializeSocket = async () => {
    try {
      const newSocket = io(SERVER_URL, {
        transports: ['websocket', 'polling'],
        jsonp: false,
      });

      newSocket.on('connect', async () => {
        console.log('✅ Notification socket connected');
        setIsConnected(true);
        setSocket(newSocket);

        const userData = await AsyncStorage.getItem('userData');
        const driverData = await AsyncStorage.getItem('driverData');

        let routeId = 'R1';
        let clientType = 'user';
        let clientName = 'User';

        if (userData) {
          const user = JSON.parse(userData);
          routeId = ROUTE_MAPPING[String(user.busId || '').replace('BUS-', '').replace('Bus-', '').trim()] || 'R1';
          clientType = 'user';
          clientName = user.name || 'User';
        } else if (driverData) {
          const driver = JSON.parse(driverData);
          routeId = ROUTE_MAPPING[String(driver.busId || '').replace('BUS-', '').replace('Bus-', '').trim()] || 'R1';
          clientType = 'driver';
          clientName = driver.name || 'Driver';
        }

        setUserRouteId(routeId);
        newSocket.emit('register', {
          clientId: clientName,
          clientType: clientType,
          routeId: routeId,
          userName: clientName,
        });
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      // Real-time message notification
      newSocket.on('new_message', async (message) => {
        const userData = await AsyncStorage.getItem('userData');
        const driverData = await AsyncStorage.getItem('driverData');

        let myRouteId = null;
        let myName = '';

        if (userData) {
          const user = JSON.parse(userData);
          myRouteId = ROUTE_MAPPING[String(user.busId || '').replace('BUS-', '').replace('Bus-', '').trim()] || null;
          myName = user.name || '';
        } else if (driverData) {
          const driver = JSON.parse(driverData);
          myRouteId = ROUTE_MAPPING[String(driver.busId || '').replace('BUS-', '').replace('Bus-', '').trim()] || null;
          myName = driver.name || '';
        }

        if (message.routeId !== myRouteId) return;
        if (message.senderName === myName) return;

        const senderLabel = message.senderType === 'admin' ? '👨‍💼 Admin' :
          message.senderType === 'driver' ? '🚌 Driver' : '👤 ' + message.senderName;

        await showPushNotification(
          'New Message — EduFleet',
          `${senderLabel}: ${message.message}`,
          message.routeId
        );

        Vibration.vibrate([0, 300, 100, 300]);

        const newNotification = {
          id: Date.now().toString(),
          title: 'New Message',
          message: message.message,
          routeId: message.routeId,
          senderType: message.senderType,
          senderName: message.senderName,
          time: message.time,
          isNew: true,
          isAdmin: message.senderType === 'admin',
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 50));
        setUnreadCount(prev => prev + 1);
        saveUnreadCount();
        updateMessageCount(message.routeId);
      });

      // ✅ FIXED: Admin broadcast notification
      newSocket.on('notification', async (notification) => {
        const userData = await AsyncStorage.getItem('userData');
        const driverData = await AsyncStorage.getItem('driverData');
        let myRouteId = null;

        if (userData) {
          const user = JSON.parse(userData);
          myRouteId = ROUTE_MAPPING[String(user.busId || '').replace('BUS-', '').replace('Bus-', '').trim()] || null;
        } else if (driverData) {
          const driver = JSON.parse(driverData);
          myRouteId = ROUTE_MAPPING[String(driver.busId || '').replace('BUS-', '').replace('Bus-', '').trim()] || null;
        }

        // ✅ KEY FIX: Agar routeId nahi hai toh admin broadcast hai - sabko show karo
        // Agar routeId hai toh sirf matching user ko show karo
        if (notification.routeId && notification.routeId !== myRouteId) return;

        const newNotification = {
          id: notification.id || Date.now().toString(),
          title: notification.title || '📢 Admin Alert',
          message: notification.message,
          time: notification.time || 'Just now',
          isNew: true,
          isAdmin: true,
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 50));

        await showPushNotification(
          notification.title || '📢 Admin Alert',
          notification.message,
          notification.routeId || ''
        );

        Vibration.vibrate([0, 300, 100, 300]);
        setUnreadCount(prev => prev + 1);
        saveUnreadCount();
      });

      setSocket(newSocket);
    } catch (error) {
      console.error('Socket error:', error);
    }
  };

  const updateMessageCount = (routeId) => {
    AsyncStorage.getItem('messageCounts').then(stored => {
      const counts = stored ? JSON.parse(stored) : {};
      counts[routeId] = (counts[routeId] || 0) + 1;
      AsyncStorage.setItem('messageCounts', JSON.stringify(counts));
    });
  };

  const loadUserRouteId = async () => {
    try {
      const driverData = await AsyncStorage.getItem('driverData');
      const userData = await AsyncStorage.getItem('userData');
      if (driverData) {
        const driver = JSON.parse(driverData);
        const routeId = ROUTE_MAPPING[String(driver.busId || '').trim()] || 'R1';
        setUserRouteId(routeId);
      } else if (userData) {
        const user = JSON.parse(userData);
        const routeId = ROUTE_MAPPING[String(user.busId || '').trim()] || 'R1';
        setUserRouteId(routeId);
      }
    } catch (error) {
      console.error('Error loading route ID:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await AsyncStorage.getItem('unreadNotifications');
      if (count) setUnreadCount(parseInt(count));
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const saveUnreadCount = async () => {
    try {
      const count = await AsyncStorage.getItem('unreadNotifications');
      const current = count ? parseInt(count) : 0;
      await AsyncStorage.setItem('unreadNotifications', (current + 1).toString());
    } catch (error) {
      console.error('Error saving unread count:', error);
    }
  };

  const clearUnreadNotifications = () => {
    setUnreadCount(0);
    AsyncStorage.setItem('unreadNotifications', '0');
    AsyncStorage.removeItem('messageCounts');
  };

  const clearRouteNotifications = (routeId) => {
    AsyncStorage.getItem('messageCounts').then(stored => {
      const counts = stored ? JSON.parse(stored) : {};
      counts[routeId] = 0;
      AsyncStorage.setItem('messageCounts', JSON.stringify(counts));
    });
  };

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [socket]);

  return (
    <NotificationContext.Provider value={{
      unreadCount,
      notifications,
      isConnected,
      clearUnreadNotifications,
      clearRouteNotifications,
      getConnectionStatus: () => isConnected,
      userRouteId,
      socket,
      updateMessageCount,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

