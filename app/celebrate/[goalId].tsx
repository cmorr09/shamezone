import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useGoals } from '../../contexts/GoalsContext';

const roastMessages = [
  "Miracles happen. You actually did it.",
  "You? Succeeding? What a plot twist.",
  "Nice job. But don't get cocky.",
  "You crushed it. Try not to relapse tomorrow.",
  "Wow. A real achievement. Savor it while it lasts.",
];

export default function CelebrateScreen() {
  const { goalId } = useLocalSearchParams();
  const { goals } = useGoals();
  const router = useRouter();

  const goal = goals.find(g => g.id === goalId);
  const randomRoast = roastMessages[Math.floor(Math.random() * roastMessages.length)];

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
      >
        <Text style={styles.heading}>You crushed it!</Text>
        
        <View style={styles.roastContainer}>
          <Text style={styles.roastText}>{randomRoast}</Text>
        </View>

        <View style={styles.goalCard}>
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
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/home')}
        >
          <Text style={styles.buttonText}>Archive & Next</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  roastContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  roastText: {
    fontSize: 18,
    color: '#FF3B3B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  goalCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 20,
  },
  goalHeader: {
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#888888',
  },
  progressContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 16,
  },
  progressText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: '#1F1F1F',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  button: {
    backgroundColor: '#FF3B3B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
