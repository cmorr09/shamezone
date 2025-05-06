import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Goal, useGoals } from '../../../contexts/GoalsContext';

export default function ArchiveScreen() {
  const router = useRouter();
  const { goals } = useGoals();
  const archivedGoals = goals.filter((goal: Goal) => goal.archived === true);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Archived Goals</Text>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/home')}
      >
        <Text style={styles.backButtonText}>← Back to Goals</Text>
      </TouchableOpacity>

      {archivedGoals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You haven't crushed anything yet. Stop slacking.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {archivedGoals.map((goal: Goal) => (
            <View key={goal.id} style={styles.card}>
              <Text style={styles.title}>{goal.title}</Text>
              <Text style={styles.category}>{goal.category}</Text>
              <View style={styles.progressContainer}>
                <Text style={styles.progress}>
                  {goal.progress} / {goal.target}
                </Text>
                {goal.progress === goal.target && (
                  <Text style={styles.completedLabel}>Completed</Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 24,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    color: '#FF3B3B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progress: {
    fontSize: 14,
    color: '#888888',
  },
  completedLabel: {
    fontSize: 12,
    color: '#FF3B3B',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
});
