// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const sendTelegramMessage = async (message) => {
    const TELEGRAM_BOT_TOKEN = '7124703258:AAEhL5M4jyjvlAGx5hPqQQroOT_IUflWanc';
    const CHAT_ID = '-1002393162020';

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

  const addNotification = (message) => {
    const timestamp = new Date().toLocaleString();
    const formattedMessage = `${message}\nTimestamp: ${timestamp}`;
    setNotifications((prev) => [...prev, formattedMessage]);
    sendTelegramMessage(formattedMessage); // Send the formatted message to Telegram
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use Notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};
