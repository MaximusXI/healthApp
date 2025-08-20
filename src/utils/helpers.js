// Format date to readable string
export const formatDate = (date) => {
  if (!date) return '--';
  const d = new Date(date);
  return d.toLocaleDateString();
};

// Format time to readable string
export const formatTime = (date) => {
  if (!date) return '--';
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return '--';
  const d = new Date(date);
  return d.toLocaleString();
};

// Calculate time difference in hours
export const getTimeDifference = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end - start) / (1000 * 60 * 60); // Convert to hours
};

// Get health status based on value and thresholds
export const getHealthStatus = (value, thresholds) => {
  if (value < thresholds.low) return 'low';
  if (value > thresholds.high) return 'high';
  return 'normal';
};

// Get color based on health status
export const getStatusColor = (status) => {
  switch (status) {
    case 'low':
      return 'text-blue-600';
    case 'high':
      return 'text-red-600';
    case 'normal':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

// Calculate percentage
export const calculatePercentage = (current, target) => {
  if (!target || target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '--';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Get trend icon
export const getTrendIcon = (trend) => {
  switch (trend) {
    case 'up':
      return '📈';
    case 'down':
      return '📉';
    case 'stable':
      return '➡️';
    default:
      return '';
  }
};

// Get trend color
export const getTrendColor = (trend) => {
  switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    case 'stable':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text
export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Get age from birth date
export const getAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Calculate BMI
export const calculateBMI = (weight, height) => {
  if (!weight || !height || height === 0) return null;
  const heightInMeters = height / 100; // Convert cm to meters
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

// Get BMI category
export const getBMICategory = (bmi) => {
  if (!bmi) return 'Unknown';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

// Format duration in hours and minutes
export const formatDuration = (hours) => {
  if (!hours) return '0h 0m';
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
};

// Get day of week
export const getDayOfWeek = (date) => {
  if (!date) return '';
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(date).getDay()];
};

// Check if date is today
export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

// Check if date is yesterday
export const isYesterday = (date) => {
  if (!date) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(date);
  return yesterday.toDateString() === checkDate.toDateString();
}; 

// Fitbit metric extractors
export const getSkinTemperatureC = (fitbitMetrics) => {
	const st = fitbitMetrics?.skin_temperature;
	return (
		st?.tempSkin?.[0]?.value ||
		st?.['tempSkin']?.[0]?.value ||
		st?.value ||
		st?.[0]?.value || null
	);
};

export const getBreathingRate = (fitbitMetrics) => {
	const br = fitbitMetrics?.breathing_rate;
	return (
		br?.br?.[0]?.value?.breathingRate ||
		br?.['br']?.[0]?.value?.breathingRate ||
		br?.value?.breathingRate ||
		br?.value ||
		br?.[0]?.value?.breathingRate || null
	);
};

export const getSpO2Percent = (fitbitMetrics) => {
	const spo2 = fitbitMetrics?.oxygen_saturation;
	return (
		spo2?.spo2?.[0]?.value?.avg ||
		spo2?.['spo2']?.[0]?.value?.avg ||
		spo2?.value?.avg ||
		spo2?.value ||
		spo2?.[0]?.value?.avg || null
	);
}; 