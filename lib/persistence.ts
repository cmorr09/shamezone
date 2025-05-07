import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  GOALS: 'goals',
  SETTINGS: 'settings',
  AUTH: 'auth',
} as const;

export const loadState = async (key: keyof typeof KEYS) => {
  try {
    const data = await AsyncStorage.getItem(KEYS[key]);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading state:', error);
    throw new Error('Failed to load your data. Please try again.');
  }
}; 