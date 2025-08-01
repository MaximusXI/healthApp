import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';

export const RECORD_TYPES = [
  'ActiveCaloriesBurned',
  // 'BasalBodyTemperature',
  // 'BasalMetabolicRate',
  // 'BoneMass',
  // 'CervicalMucus',
  // 'CyclingPedalingCadence',  
  'Distance',
  // 'ElevationGained',
  // 'FloorsClimbed',
  'Steps',
  'HeartRate',
  'BloodPressure',
  'Weight',
  'Height',
  'Hydration',
  'BodyTemperature',
  // 'BasalBodyTemperature',
  // 'ExerciseSession',
  'RespiratoryRate',
  'Vo2Max',
  // 'BodyFat',
  'BloodGlucose',
  // 'LeanBodyMass',
  // 'MenstruationFlow',
  // 'MenstruationPeriod',
  // 'Nutrition',
  // 'OvulationTest',
  'OxygenSaturation',
  // 'Power',
  'RestingHeartRate',
  // 'SexualActivity',
  'SleepSession',
  // 'Speed',
  // 'StepsCadence',
  'TotalCaloriesBurned',
  // 'WheelchairPushes'
];

class HealthService {
  constructor() {
    this.isInitialized = false;
    this.permissionsGranted = false;
    this.useMockData = true; // Set to true to use mock data when Health Connect is not available
  }

  async initialize() {
    try {
      this.isInitialized = await initialize();
      return this.isInitialized;
    } catch (error) {
      console.error('Failed to initialize Health Connect:', error);
      return false;
    }
  }

  async requestPermissions() {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        console.log('Health Connect not available, using mock data');
        this.permissionsGranted = false;
        return false;
      }
    }

    try {
      const permissionList = RECORD_TYPES.map((type) => ({
        accessType: 'read',
        recordType: type,
      }));

      const granted = await requestPermission(permissionList);
      this.permissionsGranted = granted.length > 0;
      return this.permissionsGranted;
    } catch (error) {
      console.error('Failed to request permissions:', error);
      this.permissionsGranted = false;
      return false;
    }
  }

  async fetchHealthData(timeRange = '24h') {
    // If permissions not granted and we want to use mock data, return mock data
    if (!this.permissionsGranted && this.useMockData) {
      console.log('Using mock health data');
      return this.getMockHealthData(timeRange);
    }

    if (!this.permissionsGranted) {
      throw new Error('Permissions not granted');
    }

    const now = new Date();
    let startTime;

    switch (timeRange) {
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const fetchedData = {};

    for (const recordType of RECORD_TYPES) {
      try {
        const response = await readRecords(recordType, {
          timeRangeFilter: {
            operator: 'between',
            startTime: startTime.toISOString(),
            endTime: now.toISOString(),
          },
        });

        if (response.records.length > 0) {
          fetchedData[recordType] = response.records;
        }
      } catch (err) {
        console.warn(`Failed to read ${recordType}:`, err.message);
      }
    }

    return fetchedData;
  }

  getMockHealthData(timeRange = '24h') {
    const now = new Date();
    let startTime;

    switch (timeRange) {
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    return {
      Steps: [
        {
          startTime: startTime.toISOString(),
          endTime: now.toISOString(),
          count: 8500
        }
      ],
      HeartRate: [
        {
          startTime: startTime.toISOString(),
          endTime: now.toISOString(),
          beatsPerMinute: 72
        },
        {
          startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString(),
          beatsPerMinute: 68
        }
      ],
      ActiveCaloriesBurned: [
        {
          startTime: startTime.toISOString(),
          endTime: now.toISOString(),
          energy: { inKilocalories: 450 }
        }
      ],
      SleepSession: [
        {
          startTime: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
        }
      ],
      Weight: [
        {
          startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          weight: { inKilograms: 70.5 }
        }
      ]
    };
  }

  getLatestValue(records, valueExtractor) {
    if (!records || records.length === 0) return null;
    
    const sortedRecords = records.sort((a, b) => 
      new Date(b.startTime) - new Date(a.startTime)
    );
    
    return valueExtractor(sortedRecords[0]);
  }

  getAggregatedData(healthData) {
    const aggregated = {};

    // Steps
    if (healthData.Steps) {
      const totalSteps = healthData.Steps.reduce((sum, record) => sum + record.count, 0);
      aggregated.steps = {
        total: totalSteps,
        latest: this.getLatestValue(healthData.Steps, record => record.count),
        average: Math.round(totalSteps / healthData.Steps.length)
      };
    }

    //distance
    if (healthData.Distance) {
      const totalDistance = healthData.Distance.reduce((sum, record) => sum + record.distance?.inMeters, 0);
      aggregated.distance = {
        total: Number(totalDistance.toFixed(2)),
        latest: this.getLatestValue(healthData.Distance, record => record.distance?.inMeters),
        average: Math.round(totalDistance / healthData.Distance.length)
      };
    }

    // Heart Rate
    if (healthData.HeartRate) {
      const heartRates = healthData.HeartRate.map(record => record.samples[0]?.beatsPerMinute);
      aggregated.heartRate = {
        latest: this.getLatestValue(healthData.HeartRate, record => record.samples[0]?.beatsPerMinute),
        average: Math.round(heartRates.reduce((sum, rate) => sum + rate, 0) / heartRates.length),
        min: Math.min(...heartRates),
        max: Math.max(...heartRates)
      };
    }

    // Calories
    if (healthData.TotalCaloriesBurned) {
      const totalCalories = healthData.TotalCaloriesBurned.reduce(
        (sum, record) => sum + (record.energy?.inKilocalories || 0), 0
      );
      aggregated.calories = {
        total: Math.round(totalCalories),
        latest: this.getLatestValue(healthData.TotalCaloriesBurned, record => record.energy?.inKilocalories),
        average: Math.round(totalCalories / healthData.TotalCaloriesBurned.length)
      };
    }

    // Weight
    if (healthData.Weight) {
      aggregated.weight = {
        latest: this.getLatestValue(healthData.Weight, record => record.weight?.inKilograms),
        trend: this.getWeightTrend(healthData.Weight)
      };
    }

    // Sleep
    if (healthData.SleepSession) {
      aggregated.sleep = this.calculateSleepMetrics(healthData.SleepSession);
    }

    //water
    if (healthData.Hydration) {
      const totalWater = healthData.Hydration.reduce((sum, record) => sum + record.volume?.inMilliliters, 0);
      aggregated.water = {
        latest: this.getLatestValue(healthData.Hydration, record => record.volume?.inMilliliters),
        average: Math.round(totalWater / healthData.Hydration.length)
      };
    }

    //Blood Pressure
    if (healthData.BloodPressure) {
      const totalBloodPressure = healthData.BloodPressure.reduce((sum, record) => sum + record.systolic?.inMillimetersOfMercury, 0);
      aggregated.bloodPressure = {
        latest: this.getLatestValue(healthData.BloodPressure, record => record.systolic?.inMillimetersOfMercury),
        average: Math.round(totalBloodPressure / healthData.BloodPressure.length)
      };
    }

    return aggregated;
  }

  getWeightTrend(weightRecords) {
    if (weightRecords.length < 2) return 'stable';
    
    const sortedRecords = weightRecords.sort((a, b) => 
      new Date(a.startTime) - new Date(b.startTime)
    );
    
    const firstWeight = sortedRecords[0].weight?.inKilograms;
    const lastWeight = sortedRecords[sortedRecords.length - 1].weight?.inKilograms;
    
    if (lastWeight > firstWeight + 0.5) return 'increasing';
    if (lastWeight < firstWeight - 0.5) return 'decreasing';
    return 'stable';
  }

  calculateSleepMetrics(sleepRecords) {
    const totalSleepTime = sleepRecords.reduce((total, record) => {
      const start = new Date(record.startTime);
      const end = new Date(record.endTime);
      return total + (end - start);
    }, 0);

    const averageSleepHours = totalSleepTime / (sleepRecords.length * 1000 * 60 * 60);

    return {
      totalHours: Math.round((totalSleepTime / (1000 * 60 * 60)) * 10) / 10,
      averageHours: Math.round(averageSleepHours * 10) / 10,
      sessions: sleepRecords.length
    };
  }
}

export default new HealthService(); 