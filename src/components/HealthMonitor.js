import { useEffect, useRef } from 'react';
import { database, ref, onValue, remove, get, set, } from '../firebase';

function HealthMonitor() {
  const previousHealthStatuses = useRef({}); // Tracks previous health statuses

  useEffect(() => {
    const plantsRef = ref(database, 'plants');

    // Real-time listener to track changes in plant health statuses
    const unsubscribe = onValue(plantsRef, async (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      // Process each plant data
      for (const [plantId, plantData] of Object.entries(data)) {
        if (!plantData) continue;

        const currentHealthStatus = plantData.healthStatus;
        const previousHealthStatus = previousHealthStatuses.current[plantId];
        const plantName = plantData.name;

        // Add a notification if health status changes to "Infected"
        if (currentHealthStatus === 'Infected' && previousHealthStatus !== 'Infected') {
          const notificationRef = ref(database, `notifications/${plantId}`);

          // Check if the notification already exists
          const existingNotification = await get(notificationRef);
          const existingData = existingNotification.exists() ? existingNotification.val() : null;

          const notificationData = {
            processed: existingData?.processed ?? false,
            message: `${plantName} is Infected.`,
            // Preserve the existing timestamp if the notification already exists
            timestamp: existingData?.timestamp || new Date().toLocaleString(),
          };

          set(notificationRef, notificationData).catch((error) => {
            console.error(`Error adding notification for Plant ${plantId}:`, error);
          });
        }

        // Remove the notification if health status changes to "Good"
        if (currentHealthStatus === 'Good' && previousHealthStatus === 'Infected') {
          removeNotification(plantId);
        }

        // Update previous health status for the plant
        previousHealthStatuses.current[plantId] = currentHealthStatus;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Function to remove notification from the database
  const removeNotification = (plantId) => {
    const notificationRef = ref(database, `notifications/${plantId}`);
    remove(notificationRef).catch((error) => {
      console.error(`Error removing notification for Plant ${plantId}:`, error);
    });
  };

  return null;
}

export default HealthMonitor;
