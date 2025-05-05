import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { useGoals } from '../../contexts/GoalsContext';

const insultMessages = [
  "Miracles happen. You actually did it.",
  "You? Succeeding? What a plot twist.",
  "Nice job. But don't get cocky.",
  "You crushed it. Try not to relapse tomorrow.",
  "Wow. A real achievement. Savor it while it lasts.",
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function CelebrateScreen() {
  const { goalId } = useLocalSearchParams();
  const { goals, archiveGoal } = useGoals();
  const router = useRouter();
  const scale = useSharedValue(1);

  const goal = goals.find(g => g.id === goalId);
  const randomInsult = insultMessages[Math.floor(Math.random() * insultMessages.length)];

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Goal not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text 
          entering={FadeInDown.duration(600).springify()}
          style={styles.heading}
        >
          You crushed it!
        </Animated.Text>
        
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={styles.roastContainer}
        >
          <Text style={styles.roastText}>{randomInsult}</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).duration(600).springify()}
          style={styles.goalCard}
        >
          <View style={styles.goalHeader}>
            <View>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.categoryLabel}>{goal.category}</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {goal.progress} / {goal.target} logged
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View 
        entering={FadeIn.delay(600)}
        style={styles.footer}
      >
        <AnimatedTouchable
          style={[styles.button, buttonStyle]}
          onPress={() => {
            archiveGoal(goal.id);
            router.push('/home');
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Archive & Next</Text>
        </AnimatedTouchable>
      </Animated.View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 48,
    minHeight: '100%',
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    ...Platform.select({
      ios: {
        letterSpacing: -0.5,
      },
    }),
  },
  roastContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
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
  roastText: {
    fontSize: 20,
    color: '#FF3B3B',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 28,
  },
  goalCard: {
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
  goalHeader: {
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        letterSpacing: -0.5,
      },
    }),
  },
  categoryLabel: {
    fontSize: 16,
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 20,
  },
  progressText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
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
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});

