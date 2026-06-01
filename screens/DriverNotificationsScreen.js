import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNotifications } from '../context/NotificationContext';
import { useNavigation } from '@react-navigation/native';

export default function DriverNotificationsScreen() {
  const { notifications, isConnected, clearUnreadNotifications } = useNotifications();
  const navigation = useNavigation();

  useEffect(() => {
    clearUnreadNotifications();
  }, []);

  const allNotifications = notifications.length > 0 ? notifications : [
    {
      id: '1',
      title: 'Route Update',
      message: 'Today route has been updated by admin',
      time: '2 min ago',
      isAdmin: true,
    },
    {
      id: '2',
      title: 'Delay Alert',
      message: 'Bus will arrive 10 minutes late',
      time: '10 min ago',
      isAdmin: false,
    },
    {
      id: '3',
      title: 'Ride Reminder',
      message: 'Please start your ride on time',
      time: '1 hour ago',
      isAdmin: false,
    },
  ];

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>System alerts</Text>
          </View>
        </View>

        <FlatList
          data={allNotifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Left icon */}
              <View style={styles.iconWrapper}>
                <View style={styles.iconCircle}>
                  <Icon
                    name={'notifications-outline'}
                    size={22}
                    color={'#fff'}
                  />
                </View>
                {item.isNew && (
                  <View style={styles.greenDot} />
                )}
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMsg}>{item.message}</Text>
                <Text style={styles.time}>🕐 {item.time}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.40)',
  },
  container: {
    paddingTop: 55,
    paddingHorizontal: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: '#eaeaea',
    marginTop: 2,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    gap: 12,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  cardMsg: {
    fontSize: 13,
    color: '#e0e0e0',
    marginTop: 3,
    lineHeight: 18,
  },
  time: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 6,
  },
});
