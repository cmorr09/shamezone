import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGoals } from '../../contexts/GoalsContext';
import { useSettings } from '../../contexts/SettingsContext';
import { scheduleGoalNotification } from '../../lib/notifications';
import { setOnboardingComplete } from '../../lib/onboarding'; // ✅ Add this line

const { width } = Dimensions.get('window');

const TONE_EMOJIS = {
  soft: '🍼',
  tryMe: '🥊',
  nuclear: '☢️',
} as const;

const TONE_LABELS = {
  soft: "You're soft",
  tryMe: 'Try me',
  nuclear: 'Nuclear',
} as const;

export default function RecapScreen() {
  const router = useRouter();
  const { tone, notificationHour, notificationMinute } = useSettings();
  const { goals } = useGoals();
  const goal = goals[0];

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTimeDisplay = () => {
    if (tone === 'soft') {
      return `${notificationHour.toString().padStart(2, '0')}:${notificationMinute
        .toString()
        .padStart(2, '0')}`;
    } else if (tone === 'tryMe') {
      if (notificationHour === 7) return '7am–10am';
      if (notificationHour === 10) return '10am–1pm';
      if (notificationHour === 13) return '1pm–4pm';
      if (notificationHour === 16) return '4pm–7pm';
      return 'Random (7am–11pm)';
    } else {
      return 'Random (7am–11pm)';
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.heading}>You're in now.</Text>

        <View style={styles.card}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.emoji}>{TONE_EMOJIS[tone]}</Text>
              <Text style={styles.sectionTitle}>{TONE_LABELS[tone]}</Text>
            </View>
            <Text style={styles.sectionText}>
              {tone === 'soft'
                ? "You'll get gentle reminders at exactly the time you chose."
                : tone === 'tryMe'
                ? "We'll surprise you within your chosen window. Don't say we didn't warn you."
                : "You're in for a wild ride. Random pushes throughout the day."}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Time</Text>
            <Text style={styles.sectionText}>{getTimeDisplay()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your First Goal</Text>
            <Text style={styles.goalTitle}>{goal?.title}</Text>
            <Text style={styles.goalDetails}>
              {goal?.category} • Target: {goal?.target}
            </Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (!goal) return;

            await scheduleGoalNotification(
              goal,
              tone,
              notificationHour,
              notificationMinute
            );

            await setOnboardingComplete(); // ✅ Set onboarding complete flag
            router.push('/home');
          }}
        >
          <Text style={styles.buttonText}>Enter the Zone</Text>
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
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#888888',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginBottom: 24,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  goalDetails: {
    fontSize: 16,
    color: '#888888',
  },
  footer: {
    padding: 24,
    backgroundColor: '#1F1F1F',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  button: {
    backgroundColor: '#FF3B3B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: width - 48,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

