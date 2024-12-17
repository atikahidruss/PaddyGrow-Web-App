import { useEffect, useRef, useState } from 'react';
import { database, ref, set, remove, onValue } from '../firebase';
import { useNotification } from './NotificationContext'; // Import useNotification hook

function HealthMonitor() {
  const previousHealthStatuses = useRef({});
  const [sentNotifications, setSentNotifications] = useState({});
  const { addNotification } = useNotification(); // Get addNotification function from context

  useEffect(() => {
    const plantsRef = ref(database, 'plants');

    const unsubscribe = onValue(plantsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.entries(data).forEach(([plantId, plantData]) => {
          if (!plantData) return;

          const currentHealthStatus = plantData.healthStatus;
          const previousHealthStatus = previousHealthStatuses.current[plantId];
          const plantName = plantData.name;

          console.log(`Processing Plant ID: ${plantId}, Current Health Status: ${currentHealthStatus}`);

          // When the health status changes to "Infected"
          if (currentHealthStatus === 'Infected' && previousHealthStatus !== 'Infected' && !sentNotifications[plantId]) {
            console.log(`Adding notification for ${plantName}`);

            // Add the notification to Firebase
            const notificationData = {
              message: `${plantName} is Infected.`,
              timestamp: new Date().toLocaleString(),
            };

            // Store the notification in Firebase
            set(ref(database, `notifications/${plantId}`), notificationData)
              .then(() => {
                console.log(`Notification added for ${plantName} in Firebase`);
              })
              .catch((error) => {
                console.error('Error adding notification to Firebase:', error);
              });

            // Add notification message to context and send Telegram message
            addNotification(`${plantName} is Infected.`);
            setSentNotifications((prev) => ({ ...prev, [plantId]: true }));
          }

          // If the plant's health status goes back to "Good", remove the notification
          if (currentHealthStatus === 'Good' && previousHealthStatus === 'Infected') {
            console.log(`Removing notification for ${plantName}`);
            removeNotification(plantId);
            setSentNotifications((prev) => {
              const updated = { ...prev };
              delete updated[plantId];
              return updated;
            });
          }

          previousHealthStatuses.current[plantId] = currentHealthStatus;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [sentNotifications, addNotification]);

  const removeNotification = (plantId) => {
    const notificationRef = ref(database, `notifications/${plantId}`);
    remove(notificationRef)
      .then(() => {
        console.log(`Notification removed for Plant ID: ${plantId}`);
      })
      .catch((error) => {
        console.error('Error removing notification:', error);
      });
  };

  return null;
}

export default HealthMonitor;
