import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { database, ref, onValue } from '../firebase';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [processedNotifications, setProcessedNotifications] = useState(new Set()); // Track processed IDs

  const sendTelegramMessage = async (message) => {
    const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
    const CHAT_ID = 'YOUR_CHAT_ID';

    try {
      const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message,
      });
      console.log('Message sent:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const addNotification = useCallback(
    (id, message, firebaseTimestamp) => {
      const timestamp = firebaseTimestamp || new Date().toLocaleString();
      const formattedMessage = `${message}\nTimestamp: ${timestamp}`;

      setNotifications((prev) => {
        if (prev.some((notif) => notif.id === id)) {
          console.log(`Duplicate notification detected, not adding: ${formattedMessage}`);
          return prev; // Skip duplicate notifications
        }
        return [...prev, { id, message: formattedMessage }];
      });

      sendTelegramMessage(formattedMessage); // Send message to Telegram
    },
    []
  );

  useEffect(() => {
    const notificationsRef = ref(database, 'notifications');

    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.entries(data).forEach(([id, notification]) => {
          if (!processedNotifications.has(id)) {
            // If the notification is not yet processed, send it
            addNotification(id, notification.message, notification.timestamp);
            setProcessedNotifications((prev) => new Set(prev).add(id)); // Mark as processed
          }
        });
      }
    });

    return () => unsubscribe();
  }, [addNotification, processedNotifications]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
