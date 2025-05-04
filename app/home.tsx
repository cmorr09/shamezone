import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Placeholder icon components
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

interface Goal {
  id: string;
  title: string;
  category: 'Work' | 'Health' | 'Personal';
  target: number;
  current: number;
  deadline: Date;
  lastLogged: Date | null;
  streak: number;
}

export default function HomeScreen() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Daily Steps',
      category: 'Health',
      target: 10000,
      current: 6500,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      lastLogged: new Date(Date.now() - 12 * 60 * 60 * 1000),
      streak: 3,
    },
    {
      id: '2',
      title: 'Code Review',
      category: 'Work',
      target: 5,
      current: 5,
      deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
      lastLogged: new Date(Date.now() - 36 * 60 * 60 * 1000),
      streak: 0,
    },
  ]);

  const [logValues, setLogValues] = useState<{ [key: string]: string }>({});

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusIcon = (goal: Goal) => {
    if (goal.current >= goal.target) return <ArchiveIcon />;
    if (!goal.lastLogged) return <IceIcon />;
    
    const lastLogged = new Date(goal.lastLogged);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return lastLogged > yesterday ? <FlameIcon /> : <IceIcon />;
  };

  const handleLog = (goalId: string) => {
    const value = parseFloat(logValues[goalId] || '0');
    if (isNaN(value)) return;

    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          current: Math.min(goal.current + value, goal.target),
          lastLogged: new Date(),
        };
      }
      return goal;
    }));
    setLogValues({ ...logValues, [goalId]: '' });
  };

  const handlePreviewNotification = () => {
    // TODO: Implement notification preview
    console.log('Preview notification');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Your Goals</Text>
        
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal.current, goal.target);
          const timeRemaining = getTimeRemaining(goal.deadline);
          
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
                    style={[
                      styles.progressFill,
                      { width: `${progress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{progress}% complete</Text>
              </View>

              <View style={styles.logContainer}>
                <TextInput
                  style={styles.logInput}
                  value={logValues[goal.id]}
                  onChangeText={(text) => setLogValues({ ...logValues, [goal.id]: text })}
                  placeholder="Enter progress"
                  placeholderTextColor="#888888"
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.logButton}
                  onPress={() => handleLog(goal.id)}
                >
                  <Text style={styles.logButtonText}>Log</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.timeRemaining}>
                {timeRemaining} remaining
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handlePreviewNotification}
        >
          <Text style={styles.footerButtonText}>Preview Notification</Text>
        </TouchableOpacity>

        {goals.length < 3 && (
          <TouchableOpacity style={styles.footerButton}>
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
