  import React, { createContext, useContext, useState, useEffect, useCallback, useRef, } from 'react';
  import axios from 'axios';
  import { database, ref, onChildAdded, onChildChanged, update, } from '../firebase';
  
  const NotificationContext = createContext();
  export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const sentMessages = useRef(new Set()); // For single-session duplicate checks
    const TELEGRAM_BOT_TOKEN = '7124703258:AAEhL5M4jyjvlAGx5hPqQQroOT_IUflWanc';
    const CHAT_ID = '-1002393162020';

    // Sends a message to Telegram, skipping duplicates in the current session
    const sendTelegramMessage = async (message) => {
      if (sentMessages.current.has(message)) {
        console.log(`Duplicate message in this session, not sending: ${message}`);
        return; }
      try {
        const response = await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: CHAT_ID,
            text: message,
          }
        );
        console.log('Message sent:', response.data);
        sentMessages.current.add(message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };
  
    // Add notification to local state & attempt sending to Telegram
    const addNotification = useCallback((message, firebaseTimestamp) => {
      const timestamp = firebaseTimestamp || new Date().toLocaleString();
      const formattedMessage = `${message}\nTimestamp: ${timestamp}`;
  
      // Avoid duplicates in local state
      setNotifications((prev) => {
        if (prev.includes(formattedMessage)) {
          console.log(`Duplicate in local state, not adding: ${formattedMessage}`);
          return prev;
        }
        return [...prev, formattedMessage];
      });

      // Send Telegram message (if not already in this session’s sent set)
      sendTelegramMessage(formattedMessage);
    }, []);
  
    useEffect(() => {
      const notificationsRef = ref(database, 'notifications');
  
      // 1) Fires for each existing notification once on mount,
      //    and for every new notification added later.
      const handleChildAdded = onChildAdded(notificationsRef, (snapshot) => {
        const notification = snapshot.val();
        const key = snapshot.key;
  
        if (!notification) return;
  
        // If this notification is already processed, skip sending again
        if (notification.processed) {
          console.log(
            `ChildAdded: Notification "${key}" already processed, skipping.`
          );
          return;
        }
  
        // Not processed yet -> we handle it
        const formattedMessage = `Notification: ${notification.message}`;
        addNotification(formattedMessage, notification.timestamp);
  
        // Mark as processed in Firebase to avoid re-sending on next app load
        update(ref(database, `notifications/${key}`), { processed: true }).catch(
          (err) => {
            console.error('Failed to update processed flag:', err);
          }
        );
      });
  
      // 2) Fires when an existing notification changes
      const handleChildChanged = onChildChanged(notificationsRef, (snapshot) => {
        const updatedNotification = snapshot.val();
        // Only re‐send when `type` is "motion"
        if (updatedNotification?.type === 'motion') {
          const formattedMessage = `Notification: ${updatedNotification.message}`;
          addNotification(formattedMessage, updatedNotification.timestamp);
        }
      });
  
      // Cleanup listeners on unmount
      return () => {
        handleChildAdded();
        handleChildChanged();
      };
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
  