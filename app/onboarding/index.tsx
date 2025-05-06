import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Welcome to ShameZone</Text>

        <Text style={styles.subheading}>
          This is not a therapist. This app will insult you daily.
        </Text>

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimer}>
            By continuing, you agree to be notified in a tone of your choosing—some of which may hurt your feelings. You signed up for this.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.9}
          onPress={() => router.push('/onboarding/tone' as any)}
        >
          <Text style={styles.buttonText}>Let's Go</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        letterSpacing: -0.5,
      },
    }),
  },
  subheading: {
    fontSize: 20,
    color: '#FF3B3B',
    fontStyle: 'italic',
    marginBottom: 32,
    lineHeight: 28,
  },
  disclaimerContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  disclaimer: {
    fontSize: 16,
    color: '#888888',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    backgroundColor: '#1F1F1F',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  button: {
    backgroundColor: '#FF3B3B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: width - 48,
    ...Platform.select({
      ios: {
        shadowColor: '#FF3B3B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    ...Platform.select({
      ios: {
        letterSpacing: -0.5,
      },
    }),
  },
});

