# HealthBridge - AI-Powered Health Companion

A React Native health application that integrates with Google Health Connect to provide personalized health insights and recommendations powered by AI.

## Features

### 🏠 Dashboard
- **Health Score**: Overall health assessment based on multiple metrics
- **Quick Stats**: Daily overview of steps, heart rate, calories, and sleep
- **Goals Progress**: Visual progress tracking for health goals
- **Recent Insights**: Latest AI-generated recommendations
- **Quick Actions**: Easy navigation to detailed metrics and insights

### 📊 Metrics
- **Time Range Selection**: View data for 24 hours, 7 days, or 30 days
- **Summary Cards**: Key health metrics at a glance
- **Detailed Records**: Comprehensive view of all health data
- **Health Insights**: Analysis of your health patterns
- **Pull-to-Refresh**: Easy data synchronization

### 💡 AI Insights
- **Personalized Recommendations**: AI-generated health advice
- **Health Score**: Overall wellness assessment
- **Trend Analysis**: Track changes in health metrics over time
- **Predictions**: AI-powered health forecasting
- **Action Items**: Specific steps to improve health

### 👤 Profile & Settings
- **Health Connect Management**: Permission and sync settings
- **App Preferences**: Notifications, dark mode, language
- **Data Management**: Export, clear cache, delete data
- **Support & About**: Help, privacy policy, terms of service

## Technical Stack

- **React Native**: Cross-platform mobile development
- **NativeWind**: Utility-first CSS framework for styling
- **React Navigation**: Tab-based navigation
- **Google Health Connect**: Health data integration
- **AI Backend**: Large Language Model for health recommendations

## Health Data Integration

The app integrates with Google Health Connect to read the following health metrics:

- **Activity**: Steps, active calories burned, exercise sessions
- **Vital Signs**: Heart rate, blood pressure, respiratory rate
- **Body Measurements**: Weight, height, body fat, body temperature
- **Sleep**: Sleep sessions and quality metrics
- **Other**: Oxygen saturation, VO2 max, blood glucose

## AI-Powered Features

### Health Analysis
- Real-time health data processing
- Personalized recommendations based on individual metrics
- Trend analysis and pattern recognition
- Predictive health insights

### Recommendations Engine
- Activity optimization suggestions
- Sleep quality improvements
- Heart rate monitoring advice
- Weight management guidance
- General wellness tips

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Google Health Connect app installed on device

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HealthBridgeApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Configure Health Connect**
   - Ensure Google Health Connect is installed on your device
   - Grant necessary permissions when prompted

5. **Run the application**
   ```bash
   # For Android
npm run android

   # For iOS
   npm run ios
   ```

## Configuration

### Backend Integration
Update the AI service configuration in `src/services/aiService.js`:

```javascript
this.baseURL = 'https://your-backend-url.com/api';
// Add your API key
'Authorization': 'Bearer your-api-key'
```

### Health Connect Permissions
The app requests permissions for all supported health data types. Users can manage these permissions through the Google Health Connect app.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── HealthCard.js
│   ├── RecommendationCard.js
│   └── ProgressBar.js
├── navigation/          # Navigation configuration
│   └── AppNavigator.js
├── screens/            # Main application screens
│   ├── DashboardScreen.js
│   ├── MetricsScreen.js
│   ├── RecommendationsScreen.js
│   └── ProfileScreen.js
├── services/           # Business logic and API calls
│   ├── healthService.js
│   └── aiService.js
└── utils/              # Utility functions
```

## Key Components

### HealthCard
Displays individual health metrics with icons, values, and trends.

### RecommendationCard
Shows AI-generated health recommendations with priority levels and suggestions.

### ProgressBar
Visual progress tracking for health goals and achievements.

## Styling

The application uses NativeWind (Tailwind CSS for React Native) for consistent, responsive styling:

- **Utility-first approach**: Rapid UI development
- **Responsive design**: Adapts to different screen sizes
- **Consistent theming**: Unified color scheme and spacing
- **Modern UI**: Clean, intuitive interface

## Health Data Privacy

- **Local Processing**: Health data is processed locally when possible
- **Secure Transmission**: Data sent to backend is encrypted
- **User Control**: Users can export or delete their data
- **Minimal Data**: Only necessary data is transmitted for AI analysis

## Future Enhancements

- **Real-time Monitoring**: Continuous health data monitoring
- **Advanced Analytics**: More sophisticated health pattern analysis
- **Integration**: Connect with fitness apps and wearables
- **Social Features**: Share achievements and compete with friends
- **Custom Goals**: Personalized health goal setting
- **Notifications**: Smart health reminders and alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**HealthBridge** - Your AI-powered health companion for a better, healthier life.
