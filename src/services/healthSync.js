import { AppState } from 'react-native';
import { useEffect, useRef, useState, useContext } from 'react';
import healthService from '../services/healthService';
import { AuthContext } from '../services/AuthContext';

const healthSync = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const intervalRef = useRef(null);
  const { user } = useContext(AuthContext);

  const fetchAndSendHealthData = async () => {
    if (!user) {
      console.warn('No user signed in');
      return;
    }

    try {
      const now = new Date();
      const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const healthData = await healthService.fetchHealthData('24h');
      const token = await user.getIdToken();

      console.log('📦 Health data to send:', healthData);
      console.log('Data in String');
    //   console.log(JSON.stringify(healthData));
      console.log('👤 User:', user.email, user.uid);
      console.log('🔐 Token:', token.slice(0, 50) + '...'); // print part of token for debug

      const response = await fetch('http://YOUR_IP:5000/api/health/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          data: healthData,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        console.error('❌ Sync failed:', resData.message || 'Unknown error');
      } else {
        console.log('✅ Health data synced successfully');
      }

    } catch (err) {
      console.error('❗Error sending health data:', err.message || err);
    }
  };

  useEffect(() => {
    console.log('🔁 Setting up health sync on app state change');

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        fetchAndSendHealthData();
        intervalRef.current = setInterval(fetchAndSendHealthData, 10000);
      } else {
        clearInterval(intervalRef.current);
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
      clearInterval(intervalRef.current);
    };
  }, []);
};

export default healthSync;
