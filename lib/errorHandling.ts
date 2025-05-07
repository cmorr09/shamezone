import { Alert } from 'react-native';

export const handleError = (error: unknown, fallbackMessage = 'Something went wrong') => {
  console.error(error);
  const message = error instanceof Error ? error.message : fallbackMessage;
  Alert.alert('Error', message);
};

export const handleAsyncError = async (promise: Promise<any>, fallbackMessage = 'Something went wrong') => {
  try {
    return await promise;
  } catch (error) {
    handleError(error, fallbackMessage);
    return null;
  }
}; 