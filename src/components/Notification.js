import React, { useEffect, useState } from 'react';
import { database, ref, onValue, remove } from '../firebase';
import './Notification.css';

function Notification() {
  const [notifications, setNotifications] = useState([]); // Notifications to display

  useEffect(() => {
    const notificationsRef = ref(database, 'notifications');

    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationsArray = Object.entries(data);
        setNotifications(notificationsArray); // Set notifications once when data changes
      } else {
        setNotifications([]);
      }
      
    });

    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleClearNotification = (notificationId) => {
    // Remove notification from Firebase when user presses delete
    remove(ref(database, `notifications/${notificationId}`))
      .then(() => {
        console.log('Notification cleared successfully');
      })
      .catch((error) => {
        console.error('Error clearing notification:', error);
      });
  };

  return (
    <div className="notification-page">
      {/* Telegram link at the top of the page */}
      <div className="telegram-link-container">
        <a 
          href="https://t.me/+Xj7JO4Qp9M85Nzg1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="telegram-link"
        >
          click here to receive mobile notification! 
        </a>
      </div>
      <ul className="notification-list">
        {notifications.map(([id, notification]) => (
          <li key={id} className={`notification-item ${notification.type}`}>
            <p>{notification.timestamp}</p>
            <p>{notification.message}</p>
            <button onClick={() => handleClearNotification(id)}>Clear</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notification;

