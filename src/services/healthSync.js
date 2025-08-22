import { AppState } from 'react-native';
import { useEffect, useRef, useState, useContext } from 'react';
import healthService from '../services/healthService';
import { AuthContext } from '../services/AuthContext';
import { fetchFitbitData } from '../utils/fitbitUtil';
import { getSkinTemperatureC, getBreathingRate, getSpO2Percent } from '../utils/helpers';

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

      // Fetch health data from Health Connect
      const healthData = await healthService.fetchHealthData('24h');
      
      // Fetch Fitbit data
      let fitbitData = null;
      let skinTemperature = null;
      let breathingRate = null;
      let oxygenSaturation = null;
      
      try {
        fitbitData = await fetchFitbitData();
        
        // Extract specific metrics using helper functions
        skinTemperature = getSkinTemperatureC(fitbitData);
        breathingRate = getBreathingRate(fitbitData);
        oxygenSaturation = getSpO2Percent(fitbitData);
        
        console.log('📊 Fitbit data fetched:', {
          skinTemperature,
          breathingRate,
          oxygenSaturation,
          hasFitbitData: !!fitbitData
        });
      } catch (fitbitError) {
        console.warn('⚠️ Failed to fetch Fitbit data:', fitbitError.message);
        // Continue with health data only if Fitbit fails
      }

      const token = await user.getIdToken();

      // Prepare the data payload
      const payload = {
        userId: user.uid,
        email: user.email,
        data: healthData,
        fitbitMetrics: {
          skinTemperature: skinTemperature ? parseFloat(skinTemperature).toFixed(1) : null,
          breathingRate: breathingRate ? parseFloat(breathingRate).toFixed(1) : null,
          oxygenSaturation: oxygenSaturation ? parseFloat(oxygenSaturation).toFixed(1) : null,
        }
      };

      console.log('📦 Health data to send:', healthData);
      console.log('🌡️ Fitbit metrics to send:', payload.fitbitMetrics);
      console.log('👤 User:', user.email, user.uid);
      console.log('🔐 Token:', token.slice(0, 50) + '...'); // print part of token for debug

      const response = await fetch('https://persuasive.research.cs.dal.ca/healthbridgeapp/api/health/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        console.error('❌ Sync failed:', resData.message || 'Unknown error');
      } else {
        console.log('✅ Health data synced successfully');
        if (fitbitData) {
          console.log('✅ Fitbit data included in sync');
        } else {
          console.log('ℹ️ No Fitbit data included in sync');
        }
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
        intervalRef.current = setInterval(fetchAndSendHealthData, 60000);
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
