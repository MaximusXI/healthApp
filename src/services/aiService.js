class AIService {
  constructor() {
    // Replace with your actual backend URL
    this.baseURL = 'https://your-backend-url.com/api';
    this.useMockData = true; // Set to true to always use mock data
  }

  async sendHealthDataToBackend(healthData, aggregatedData) {
    // Always return mock data for now
    if (this.useMockData) {
      return this.getMockRecommendations(aggregatedData);
    }

    try {
      const payload = {
        healthMetrics: healthData,
        aggregatedData: aggregatedData,
        timestamp: new Date().toISOString(),
        userId: 'user123', // Replace with actual user ID
      };

      const response = await fetch(`${this.baseURL}/health-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-api-key', // Replace with actual API key
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending health data to backend:', error);
      // Return mock data for development
      return this.getMockRecommendations(aggregatedData);
    }
  }

  getMockRecommendations(aggregatedData) {
    const recommendations = {
      general: [],
      specific: {},
      insights: [],
      goals: []
    };

    // Always add some general recommendations
    recommendations.general.push({
      type: 'activity',
      title: 'Increase Daily Steps',
      description: 'Try to reach 10,000 steps daily for better cardiovascular health.',
      priority: 'high',
      icon: '🚶‍♂️'
    });

    recommendations.general.push({
      type: 'sleep',
      title: 'Improve Sleep Quality',
      description: 'Aim for 7-9 hours of sleep per night for optimal health.',
      priority: 'high',
      icon: '😴'
    });

    recommendations.general.push({
      type: 'hydration',
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily for optimal health.',
      priority: 'medium',
      icon: '💧'
    });

    // Heart rate recommendations
    if (aggregatedData.heartRate) {
      if (aggregatedData.heartRate.average > 100) {
        recommendations.specific.heartRate = {
          title: 'High Resting Heart Rate',
          description: 'Your average heart rate is elevated. Consider stress management techniques.',
          suggestions: ['Practice deep breathing', 'Reduce caffeine intake', 'Get more sleep'],
          icon: '❤️'
        };
      } else if (aggregatedData.heartRate.average < 60) {
        recommendations.specific.heartRate = {
          title: 'Low Resting Heart Rate',
          description: 'Your heart rate is quite low, which can be good for athletes.',
          suggestions: ['Monitor for symptoms', 'Stay hydrated', 'Regular check-ups'],
          icon: '❤️'
        };
      } else {
        recommendations.specific.heartRate = {
          title: 'Good Heart Rate',
          description: 'Your heart rate is within normal range. Keep up the good work!',
          suggestions: ['Continue regular exercise', 'Maintain healthy diet', 'Regular check-ups'],
          icon: '❤️'
        };
      }
    } else {
      // Default heart rate recommendation
      recommendations.specific.heartRate = {
        title: 'Monitor Heart Rate',
        description: 'Start tracking your heart rate to get personalized insights.',
        suggestions: ['Use a heart rate monitor', 'Track during exercise', 'Monitor resting rate'],
        icon: '❤️'
      };
    }

    // Weight recommendations
    if (aggregatedData.weight) {
      if (aggregatedData.weight.trend === 'increasing') {
        recommendations.specific.weight = {
          title: 'Weight Management',
          description: 'Your weight has been trending upward. Consider dietary adjustments.',
          suggestions: ['Track calorie intake', 'Increase physical activity', 'Consult nutritionist'],
          icon: '⚖️'
        };
      } else if (aggregatedData.weight.trend === 'decreasing') {
        recommendations.specific.weight = {
          title: 'Weight Loss Progress',
          description: 'Great job! Your weight is trending downward.',
          suggestions: ['Maintain healthy habits', 'Continue exercise routine', 'Monitor progress'],
          icon: '⚖️'
        };
      } else {
        recommendations.specific.weight = {
          title: 'Stable Weight',
          description: 'Your weight is stable. Focus on maintaining healthy habits.',
          suggestions: ['Regular exercise', 'Balanced diet', 'Consistent routine'],
          icon: '⚖️'
        };
      }
    } else {
      // Default weight recommendation
      recommendations.specific.weight = {
        title: 'Track Your Weight',
        description: 'Start monitoring your weight for better health insights.',
        suggestions: ['Weigh yourself regularly', 'Track trends', 'Set healthy goals'],
        icon: '⚖️'
      };
    }

    // Generate insights
    if (aggregatedData.steps && aggregatedData.calories && aggregatedData.steps.total > 0) {
      const caloriesPerStep = aggregatedData.calories.total / aggregatedData.steps.total;
      recommendations.insights.push({
        title: 'Activity Efficiency',
        description: `You burn ${caloriesPerStep.toFixed(2)} calories per step on average.`,
        icon: '📊'
      });
    }

    recommendations.insights.push({
      title: 'Health Tracking',
      description: 'Consistent health monitoring leads to better insights and recommendations.',
      icon: '📈'
    });

    // Set goals
    recommendations.goals = [
      {
        title: 'Daily Steps Goal',
        target: 10000,
        current: aggregatedData.steps?.total || 0,
        unit: 'steps',
        icon: '🎯'
      },
      {
        title: 'Sleep Goal',
        target: 8,
        current: aggregatedData.sleep?.averageHours || 0,
        unit: 'hours',
        icon: '🌙'
      },
      {
        title: 'Calories Goal',
        target: 500,
        current: aggregatedData.calories?.total || 0,
        unit: 'kcal',
        icon: '🔥'
      }
    ];

    return recommendations;
  }

  async getPersonalizedInsights(healthData, userProfile) {
    // Always return mock data for now
    if (this.useMockData) {
      return this.getMockPersonalizedInsights(healthData);
    }

    try {
      const response = await fetch(`${this.baseURL}/personalized-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-api-key',
        },
        body: JSON.stringify({
          healthData,
          userProfile,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting personalized insights:', error);
      return this.getMockPersonalizedInsights(healthData);
    }
  }

  getMockPersonalizedInsights(healthData) {
    return {
      healthScore: Math.floor(Math.random() * 30) + 70, // 70-100
      trends: [
        {
          metric: 'Steps',
          trend: 'increasing',
          change: '+15%',
          period: 'this week'
        },
        {
          metric: 'Heart Rate',
          trend: 'stable',
          change: '0%',
          period: 'this week'
        },
        {
          metric: 'Sleep',
          trend: 'improving',
          change: '+10%',
          period: 'this week'
        }
      ],
      predictions: [
        {
          metric: 'Weight',
          prediction: 'Expected to stabilize',
          confidence: '85%',
          timeframe: '2 weeks'
        },
        {
          metric: 'Fitness Level',
          prediction: 'Continued improvement',
          confidence: '90%',
          timeframe: '1 month'
        }
      ]
    };
  }
}

export default new AIService(); 