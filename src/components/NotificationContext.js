import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { database, ref, onValue } from '../firebase';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const sentMessages = useRef(new Set()); // Track messages sent to Telegram

  const sendTelegramMessage = async (message) => {
    const TELEGRAM_BOT_TOKEN = '7124703258:AAEhL5M4jyjvlAGx5hPqQQroOT_IUflWanc';
    const CHAT_ID = '-1002393162020';

    if (sentMessages.current.has(message)) {
      console.log(`Duplicate message detected, not sending: ${message}`);
      return; // Skip duplicate messages
    }

    try {
      const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message,
      });
      console.log('Message sent:', response.data);
      sentMessages.current.add(message); // Mark message as sent
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const addNotification = useCallback(
    (message, firebaseTimestamp) => {
      const timestamp = firebaseTimestamp || new Date().toLocaleString();
      const formattedMessage = `${message}\nTimestamp: ${timestamp}`;
      setNotifications((prev) => {
        if (prev.some((notif) => notif === formattedMessage)) {
          console.log(`Duplicate notification detected, not adding: ${formattedMessage}`);
          return prev; // Skip duplicate notifications
        }
        return [...prev, formattedMessage];
      });
      sendTelegramMessage(formattedMessage);
    },
    [] // No dependencies
  );

  useEffect(() => {
    const notificationsRef = ref(database, 'notifications');
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.values(data).forEach((notification) => {
          const formattedMessage = `Notification: ${notification.message}`;
          addNotification(formattedMessage, notification.timestamp);
        });
      }
    });

    return () => unsubscribe();
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
