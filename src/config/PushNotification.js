// Placeholder file to prevent import errors
// Real-time notifications are now handled directly in DriverNotificationsScreen.js

class PushNotificationController {
  constructor() {
    // Empty constructor - no initialization needed
  }

  configure = () => {
    console.log('Push notifications disabled - using real-time socket.io notifications instead');
  };

  showLocalNotification = (title, message) => {
    console.log('Local notification (placeholder):', title, message);
  };

  scheduleNotification = (title, message, date) => {
    console.log('Scheduled notification (placeholder):', title, message, date);
  };

  cancelAllNotifications = () => {
    console.log('All notifications cancelled (placeholder)');
  };

  checkPermissions = () => {
    console.log('Check permissions (placeholder)');
  };

  requestPermissions = () => {
    console.log('Request permissions (placeholder)');
  };
}

export default new PushNotificationController();
