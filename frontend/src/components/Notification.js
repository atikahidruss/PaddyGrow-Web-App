import React, { useEffect, useState } from 'react';
import { database, ref, onValue, remove } from '../firebase';
import './Notification.css';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [displayPopups, setDisplayPopups] = useState({});

  useEffect(() => {
    const notificationsRef = ref(database, 'notifications');
    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNotifications(Object.entries(data));
      } else {
        setNotifications([]);
      }
    });
  }, []);

  useEffect(() => {
    const newDisplayPopups = {};
    notifications.forEach(([id, notification]) => {
      if (!displayPopups[id]) {
        alert(notification.message);
        newDisplayPopups[id] = true;
      } else {
        newDisplayPopups[id] = displayPopups[id];
      }
    });
    setDisplayPopups(newDisplayPopups);
  }, [notifications, displayPopups]);

  const handleClearNotification = (notificationId) => {
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
      <ul className="notification-list">
        {notifications.map(([id, notification]) => (
          <li key={id} className="notification-item">
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
