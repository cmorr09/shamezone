import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import nuclearInsults from '../../assets/insults/nuclear.json';
import softInsults from '../../assets/insults/soft.json';
import tryMeInsults from '../../assets/insults/tryMe.json';
import { useGoals } from '../../contexts/GoalsContext';
import { useSettings } from '../../contexts/SettingsContext';

const FlameIcon = () => (
  <View style={[styles.icon, { backgroundColor: '#FF3B3B' }]}>
    <Text style={styles.iconText}>🔥</Text>
  </View>
);

const IceIcon = () => (
  <View style={[styles.icon, { backgroundColor: '#3B9FFF' }]}>
    <Text style={styles.iconText}>❄️</Text>
  </View>
);

const ArchiveIcon = () => (
  <View style={[styles.icon, { backgroundColor: '#888888' }]}>
    <Text style={styles.iconText}>📦</Text>
  </View>
);

export default function HomeScreen() {
  const { goals, updateGoalProgress } = useGoals();
  const { tone } = useSettings();
  const router = useRouter();

  const [logValues, setLogValues] = useState<{ [key: string]: string }>({});

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min(Math.round((progress / target) * 100), 100);
  };

  const scheduleNextNotification = async (goal: any) => {
    const now = new Date();
    const fireDate = new Date(now);
    fireDate.setDate(now.getDate() + 1);

    if (tone === "soft") {
      fireDate.setHours(9 + Math.floor(Math.random() * 1));
    } else if (tone === "tryMe") {
      fireDate.setHours(12 + Math.floor(Math.random() * 4));
    } else if (tone === "nuclear") {
      fireDate.setHours(7 + Math.floor(Math.random() * (23 - 7)));
    }

    fireDate.setMinutes(Math.floor(Math.random() * 60));
    fireDate.setSeconds(0);
    fireDate.setMilliseconds(0);

    let pool = softInsults;
    if (tone === "tryMe") pool = tryMeInsults;
    if (tone === "nuclear") pool = nuclearInsults;

    const template = pool[Math.floor(Math.random() * pool.length)];
    const message = template.replace('{goal}', goal.title);

    await scheduleNextNotification(goal);
  };

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusIcon = (goal: any) => {
    if (goal.progress >= goal.target) return <ArchiveIcon />;
    if (!goal.lastLogged) return <IceIcon />;

    const lastLogged = new Date(goal.lastLogged);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return lastLogged > yesterday ? <FlameIcon /> : <IceIcon />;
  };

  const checkIfOnTime = (now: Date, target: Date, tone: string) => {
    const diff = Math.abs(now.getTime() - target.getTime());
    if (tone === "I'm soft") return diff <= 60 * 60 * 1000;
    if (tone === "try me") return diff <= 4 * 60 * 60 * 1000;
    if (tone === "nuclear") {
      const hour = now.getHours();
      return hour >= 7 && hour <= 23;
    }
    return false;
  };

  const getRoast = (tone: string) => {
    if (tone === "I'm soft") return "Maybe later… or not.";
    if (tone === "try me") return "Still ignoring this? Prove you're not a quitter.";
    if (tone === "nuclear") return "‘This’ is still undone. Pathetic.";
    return "Not impressed.";
  };

  const handleLog = async (goalId: string, goalTime: Date) => {
    const value = parseFloat(logValues[goalId] || '0');
    if (isNaN(value) || value <= 0) return;
  
    const now = new Date();
    const isOnTime = checkIfOnTime(now, goalTime, tone);
  
    const goalCompleted = updateGoalProgress(goalId, value);
    setLogValues({ ...logValues, [goalId]: '' });
  
    const goal = goals.find((g) => g.id === goalId);
    if (goal) await scheduleNextNotification(goal);
  
    if (goalCompleted && isOnTime) {
      router.push({ pathname: `/celebrate/${goalId}` } as any);
    } else if (!isOnTime) {
      Alert.alert('Late...', `Too little, too late.\n\n${getRoast(tone)}`);
    }
  };  

  const handlePreviewNotification = () => {
    Alert.alert('Preview', 'Next notification previewed (Test Mode)');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Your Goals</Text>

        {goals.map((goal) => {
          const progress = getProgressPercentage(goal.progress, goal.target);
          const timeRemaining = goal.deadline
            ? getTimeRemaining(new Date(goal.deadline))
            : 'No deadline';

          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.categoryLabel}>{goal.category}</Text>
                </View>
                {getStatusIcon(goal)}
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${progress}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>{progress}% complete</Text>
              </View>

              <View style={styles.logContainer}>
                <TextInput
                  style={styles.logInput}
                  value={logValues[goal.id] || ''}
                  onChangeText={(text) =>
                    setLogValues({ ...logValues, [goal.id]: text })
                  }
                  placeholder="Enter progress"
                  placeholderTextColor="#888888"
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.logButton}
                  onPress={() => handleLog(goal.id, goal.time)}
                >
                  <Text style={styles.logButtonText}>Log</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.timeRemaining}>{timeRemaining} remaining</Text>
            </View>
          );
        })}

        <TouchableOpacity
          onPress={() => router.push('../home/archive')}
          style={styles.archiveButton}
        >
          <Text style={styles.archiveButtonText}>View Archived Goals</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handlePreviewNotification}
        >
          <Text style={styles.footerButtonText}>Preview Notification</Text>
        </TouchableOpacity>

        {goals.length < 3 && (
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => router.push('/setup')}
          >
            <Text style={styles.footerButtonText}>Add / Edit Goals</Text>
          </TouchableOpacity>
        )}
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  goalCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#888888',
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF3B3B',
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  logContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  logInput: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    marginRight: 8,
  },
  logButton: {
    backgroundColor: '#FF3B3B',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  logButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timeRemaining: {
    fontSize: 14,
    color: '#888888',
  },
  archiveButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    alignItems: 'center',
  },
  archiveButtonText: {
    color: '#FF3B3B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: '#1F1F1F',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  footerButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
