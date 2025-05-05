import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGoals } from '../../contexts/GoalsContext';

const { width } = Dimensions.get('window');

type Category = 'work' | 'health' | 'personal';

export default function GoalCreationScreen() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [milestones, setMilestones] = useState('');

  const router = useRouter();
  const { addGoal } = useGoals();

  const categories: { id: Category; label: string }[] = [
    { id: 'work', label: 'Work' },
    { id: 'health', label: 'Health' },
    { id: 'personal', label: 'Personal' },
  ];

  const isFormValid = title.trim() !== '' && category !== null && target.trim() !== '';

  const handleSubmit = () => {
    const parsedMilestones = milestones
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);

    addGoal({
      id: Date.now().toString(),
      title,
      category: category!.charAt(0).toUpperCase() + category!.slice(1) as 'Work' | 'Health' | 'Personal',
      target: parseInt(target),
      progress: 0,
      time: new Date(), // Placeholder — actual scheduling based on tone is handled separately
      deadline,
      milestones: parsedMilestones,
      createdAt: new Date(),
    });

    router.push('/onboarding/recap');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Create Your First Goal</Text>

        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Goal Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="What do you want to achieve?"
            placeholderTextColor="#888888"
          />
        </View>

        {/* Category Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  category === cat.id && styles.categoryButtonSelected,
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === cat.id && styles.categoryButtonTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Target Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Target</Text>
          <TextInput
            style={styles.input}
            value={target}
            onChangeText={setTarget}
            placeholder="How many units?"
            placeholderTextColor="#888888"
            keyboardType="numeric"
          />
        </View>

        {/* Deadline Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Deadline (Optional)</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setDeadline(new Date())}
          >
            <Text style={styles.dateButtonText}>
              {deadline ? deadline.toLocaleDateString() : 'Set a deadline'}
            </Text>
          </TouchableOpacity>
          {deadline && (
            <DateTimePicker
              value={deadline}
              mode="date"
              display="spinner"
              onChange={(_, date) => date && setDeadline(date)}
            />
          )}
        </View>

        {/* Milestones Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Milestones (Optional)</Text>
          <TextInput
            style={styles.input}
            value={milestones}
            onChangeText={setMilestones}
            placeholder="e.g., 10, 20, 30"
            placeholderTextColor="#888888"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          disabled={!isFormValid}
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, !isFormValid && styles.buttonTextDisabled]}>
            Start My Shame
          </Text>
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
    padding: 24,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: '#FF3B3B',
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
  dateButton: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  buttonDisabled: {
    backgroundColor: '#2A2A2A',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: '#888888',
  },
});

