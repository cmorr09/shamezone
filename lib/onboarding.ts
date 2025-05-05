import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'onboardingComplete';

export const setOnboardingComplete = async () => {
  await AsyncStorage.setItem(KEY, 'true');
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(KEY);
  return value === 'true';
};
