import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { GoalsProvider } from '../contexts/GoalsContext';
import { SettingsProvider } from '../contexts/SettingsContext';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useScheduleNotifications } from '@/hooks/useScheduleNotifications';
import { isOnboardingComplete } from '../lib/onboarding';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useScheduleNotifications();

  useEffect(() => {
    const checkOnboarding = async () => {
      const complete = await isOnboardingComplete();
      if (!complete) {
        router.replace('/onboarding');
      }
      setChecking(false);
    };

    checkOnboarding();
  }, []);

  if (!loaded || checking) {
    return <View style={{ flex: 1, backgroundColor: '#0D0D0D' }} />;
  }

  return (
    <SettingsProvider>
      <GoalsProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </GoalsProvider>
    </SettingsProvider>
  );
}

