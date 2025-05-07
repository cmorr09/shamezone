import NetInfo from '@react-native-community/netinfo';

export const checkNetworkConnection = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected;
};

export const handleNetworkError = (error: any) => {
  if (error.message?.includes('network')) {
    return {
      title: "Network Error",
      message: "Please check your internet connection and try again."
    };
  }
  return null;
}; 