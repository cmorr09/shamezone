import React, { useState } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings } from '../../contexts/SettingsContext';

const { width } = Dimensions.get('window');

type Tone = 'soft' | 'tryMe' | 'nuclear' | null;

export default function ToneSelectionScreen() {
  const router = useRouter();
  const { setTone } = useSettings();
  const [selectedTone, setSelectedTone] = useState<Tone>(null);

  const tones = [
    { id: 'soft', emoji: '🍼', label: "I'm soft" },
    { id: 'tryMe', emoji: '🥊', label: 'Try me' },
    { id: 'nuclear', emoji: '☢️', label: 'Nuclear' },
  ] as const;

  const handleNext = () => {
    if (selectedTone) {
      setTone(selectedTone);
      router.push('/onboarding/time');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>How Tough are You?</Text>

        <View style={styles.cardsContainer}>
          {tones.map((tone) => (
            <TouchableOpacity
              key={tone.id}
              style={[
                styles.card,
                selectedTone === tone.id && styles.selectedCard,
              ]}
              activeOpacity={0.9}
              onPress={() => setSelectedTone(tone.id)}
            >
              <Text style={styles.emoji}>{tone.emoji}</Text>
              <Text style={styles.cardLabel}>{tone.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedTone && styles.buttonDisabled]}
          activeOpacity={0.9}
          disabled={!selectedTone}
          onPress={handleNext}
        >
          <Text style={[styles.buttonText, !selectedTone && styles.buttonTextDisabled]}>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 48,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        letterSpacing: -0.5,
      },
    }),
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
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
  selectedCard: {
    borderColor: '#FF3B3B',
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  cardLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    ...Platform.select({
      ios: {
        letterSpacing: -0.5,
      },
    }),
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
  buttonDisabled: {
    backgroundColor: '#2A2A2A',
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
  buttonTextDisabled: {
    color: '#888888',
  },
});
