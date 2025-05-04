import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGoals } from '../contexts/GoalsContext';
import { useSettings } from '../contexts/SettingsContext';

type Tone = 'soft' | 'tryMe' | 'nuclear';

interface ToneOption {
  id: Tone;
  title: string;
  description: string;
  sampleMessage: string;
  hasTimePicker: boolean;
  timeRange?: {
    min: number;
    max: number;
  };
}

const toneOptions: ToneOption[] = [
  {
    id: 'soft',
    title: "I'm soft",
    description: 'Gentle reminders every hour',
    sampleMessage: "Hey, you? Remember '{goal}'? Maybe later...?",
    hasTimePicker: true,
    timeRange: { min: 1, max: 1 },
  },
  {
    id: 'tryMe',
    title: 'Try me',
    description: 'Random reminders every 4 hours',
    sampleMessage: "Still ignoring '{goal}'? Prove you're not a quitter.",
    hasTimePicker: true,
    timeRange: { min: 4, max: 4 },
  },
  {
    id: 'nuclear',
    title: 'Nuclear',
    description: 'Chaos Mode - Random between 7am–11pm',
    sampleMessage: "'{goal}' is still undone. Pathetic.",
    hasTimePicker: false,
    timeRange: { min: 7, max: 23 },
  },
];

export default function ToneScreen() {
  const [selectedTone, setSelectedTone] = useState<Tone>('soft');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const { setSettings } = useSettings();
  const { setGoals } = useGoals();
  const router = useRouter();

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  const handleStartAccountability = () => {
    const timeValue = selectedTone === 'nuclear' ? null : selectedTime;
  
    setSettings({
      tone: selectedTone,
      time: timeValue,
      testMode: false,
    });
  
    setGoals((prevGoals) =>
      prevGoals.map((goal) => ({
        ...goal,
        time: timeValue,
      }))
    );
  
    router.push('/home');
  };  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose Your Tone</Text>

      {toneOptions.map((tone) => (
        <TouchableOpacity
          key={tone.id}
          style={[
            styles.toneContainer,
            selectedTone === tone.id && styles.selectedTone,
          ]}
          onPress={() => setSelectedTone(tone.id)}
        >
          <View style={styles.toneHeader}>
            <Text style={styles.toneTitle}>{tone.title}</Text>
            <Text style={styles.toneDescription}>{tone.description}</Text>
          </View>

          <View style={styles.sampleContainer}>
            <Text style={styles.sampleLabel}>Sample Message:</Text>
            <Text style={styles.sampleMessage}>
              {tone.sampleMessage.replace('{goal}', 'your goal')}
            </Text>
          </View>

          {tone.hasTimePicker && selectedTone === tone.id && (
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                {selectedTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>
          )}

          {showTimePicker && selectedTone === tone.id && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartAccountability}
      >
        <Text style={styles.startButtonText}>Start Accountability</Text>
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
  toneContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  selectedTone: {
    borderWidth: 2,
    borderColor: '#FF3B3B',
  },
  toneHeader: {
    marginBottom: 12,
  },
  toneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  toneDescription: {
    fontSize: 14,
    color: '#888888',
  },
  sampleContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  sampleLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
  sampleMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  timeButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  timeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#FF3B3B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
