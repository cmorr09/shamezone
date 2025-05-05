import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSettings } from '../../contexts/SettingsContext';

const { width } = Dimensions.get('window');

const TIME_WINDOWS = ['7am–10am', '12pm–3pm', '5pm–8pm'];

export default function TimeSelectionScreen() {
  const router = useRouter();
  const { tone, setTime } = useSettings();

  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);

  const handleNext = () => {
    if (tone === 'soft' && selectedTime) {
      setTime(selectedTime);
    } else {
      setTime(null); // random handling for tryMe or nuclear
    }
    router.push('/onboarding/goal');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>When should we push you?</Text>

        {tone === 'soft' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.emoji}>🍼</Text>
              <Text style={styles.sectionTitle}>I'm soft</Text>
            </View>
            <Text style={styles.sectionMessage}>Pick an exact time to be notified</Text>
            <View style={styles.timePickerContainer}>
              <DateTimePicker
                value={selectedTime || new Date()}
                mode="time"
                display="spinner"
                onChange={(_, date) => {
                  if (date) setSelectedTime(date);
                }}
                style={styles.timePicker}
              />
            </View>
          </View>
        )}

        {tone === 'tryMe' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.emoji}>🥊</Text>
              <Text style={styles.sectionTitle}>Try me</Text>
            </View>
            <Text style={styles.sectionMessage}>
              Select a 3-hour window where we’ll choose when to push you
            </Text>
            {TIME_WINDOWS.map((window) => (
              <TouchableOpacity
                key={window}
                style={[
                  styles.dropdown,
                  selectedWindow === window && styles.selectedDropdown,
                ]}
                onPress={() => setSelectedWindow(window)}
              >
                <Text style={styles.dropdownText}>{window}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {tone === 'nuclear' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.emoji}>☢️</Text>
              <Text style={styles.sectionTitle}>Nuclear</Text>
            </View>
            <Text style={styles.sectionMessage}>
              You’ll get 1–3 random pushes daily between 7am–11pm.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            (tone === 'soft' && !selectedTime) ||
            (tone === 'tryMe' && !selectedWindow)
              ? styles.buttonDisabled
              : null,
          ]}
          onPress={handleNext}
          disabled={
            (tone === 'soft' && !selectedTime) ||
            (tone === 'tryMe' && !selectedWindow)
          }
        >
          <Text
            style={[
              styles.buttonText,
              (tone === 'soft' && !selectedTime) ||
              (tone === 'tryMe' && !selectedWindow)
                ? styles.buttonTextDisabled
                : null,
            ]}
          >
            Next
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
    ...Platform.select({
      ios: {
        letterSpacing: -0.5,
      },
    }),
  },
  section: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionMessage: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 24,
    lineHeight: 24,
  },
  timePickerContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
  },
  timePicker: {
    height: 200,
  },
  dropdown: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedDropdown: {
    borderColor: '#FF3B3B',
    borderWidth: 2,
  },
  dropdownText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
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

