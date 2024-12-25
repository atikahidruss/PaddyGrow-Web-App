import { useEffect, useRef } from 'react';
import { database, ref, set, remove, onValue } from '../firebase';

function HealthMonitor() {
  const previousHealthStatuses = useRef({});

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

          if (currentHealthStatus === 'Infected' && previousHealthStatus !== 'Infected') {
            const notificationData = {
              message: `${plantName} is Infected.`,
              timestamp: new Date().toLocaleString(),
            };

            set(ref(database, `notifications/${plantId}`), notificationData).catch((error) => {
              console.error('Error adding notification to Firebase:', error);
            });
          }

          if (currentHealthStatus === 'Good' && previousHealthStatus === 'Infected') {
            removeNotification(plantId);
          }

          previousHealthStatuses.current[plantId] = currentHealthStatus;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const removeNotification = (plantId) => {
    const notificationRef = ref(database, `notifications/${plantId}`);
    remove(notificationRef).catch((error) => {
      console.error('Error removing notification:', error);
    });
  };

  return null;
}

export default HealthMonitor;
