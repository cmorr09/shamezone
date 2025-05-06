import { Picker } from '@react-native-picker/picker';
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
import { useGoals } from '../contexts/GoalsContext';

interface Goal {
  title: string;
  category: 'Work' | 'Health' | 'Personal';
  target: string;
  deadline: Date | null;
  milestones: string[];
}

export default function SetupScreen() {
  const router = useRouter();
  const { setGoals } = useGoals();

  const [goals, setLocalGoals] = useState<Goal[]>([
    {
      title: '',
      category: 'Work',
      target: '',
      deadline: null,
      milestones: ['', '', ''],
    },
  ]);

  const addGoal = () => {
    if (goals.length < 3) {
      setLocalGoals([
        ...goals,
        {
          title: '',
          category: 'Work',
          target: '',
          deadline: null,
          milestones: ['', '', ''],
        },
      ]);
    }
  };

  const updateGoal = (index: number, field: keyof Goal, value: string | Date | null) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setLocalGoals(newGoals);
  };

  const updateMilestone = (goalIndex: number, milestoneIndex: number, value: string) => {
    const newGoals = [...goals];
    newGoals[goalIndex].milestones[milestoneIndex] = value;
    setLocalGoals(newGoals);
  };

  const handleContinue = () => {
    const filtered = goals.filter(g => g.title.trim() !== '');
    if (filtered.length === 0) {
      Alert.alert('Oops', 'Please enter at least one valid goal.');
      return;
    }

    const formatted = filtered.map((g, i) => ({
      ...g,
      id: String(Date.now() + i),
      target: parseFloat(g.target) || 0, // ✅ Safe number parsing
      progress: 0,
      time: new Date(),
      createdAt: new Date(),
      archived: false,
    }));

    setGoals(formatted);
    router.push('/settings/tone');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Set Your Goals</Text>

      {goals.map((goal, goalIndex) => (
        <View key={goalIndex} style={styles.goalContainer}>
          <Text style={styles.goalNumber}>Goal {goalIndex + 1}</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={goal.title}
            onChangeText={(text) => updateGoal(goalIndex, 'title', text)}
            placeholder="Enter goal title"
            placeholderTextColor="#888888"
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={goal.category}
              onValueChange={(value) => updateGoal(goalIndex, 'category', value)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="Work" value="Work" color="#FFFFFF" />
              <Picker.Item label="Health" value="Health" color="#FFFFFF" />
              <Picker.Item label="Personal" value="Personal" color="#FFFFFF" />
            </Picker>
          </View>

          <Text style={styles.label}>Target</Text>
          <TextInput
            style={styles.input}
            value={goal.target}
            onChangeText={(text) => updateGoal(goalIndex, 'target', text)}
            placeholder="Enter numeric target"
            placeholderTextColor="#888888"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Deadline (Optional)</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              // TODO: Implement date picker modal
              Alert.alert('Coming soon', 'Date picker not yet implemented.');
            }}
          >
            <Text style={styles.dateButtonText}>
              {goal.deadline ? goal.deadline.toLocaleDateString() : 'Select Date'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Milestones (Optional)</Text>
          {goal.milestones.map((milestone, milestoneIndex) => (
            <TextInput
              key={milestoneIndex}
              style={styles.input}
              value={milestone}
              onChangeText={(text) => updateMilestone(goalIndex, milestoneIndex, text)}
              placeholder={`Milestone ${milestoneIndex + 1}`}
              placeholderTextColor="#888888"
            />
          ))}
        </View>
      ))}

      {goals.length < 3 && (
        <TouchableOpacity style={styles.addButton} onPress={addGoal}>
          <Text style={styles.addButtonText}>+ Add Another Goal</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  goalContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  goalNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    height: 50,
  },
  dateButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FF3B3B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#FF3B3B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
