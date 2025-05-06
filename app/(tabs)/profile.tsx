import Constants from 'expo-constants';
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSettings } from '../../contexts/SettingsContext';
import { useGoals } from '../../contexts/GoalsContext';
import { getGoalsCrushed, getStreakCount, getDaysMissed } from '../../lib/stats';

export default function ProfileScreen() {
  const {
    tone,
    time,
    testMode,
    setTestMode,
  } = useSettings();

  const { goals } = useGoals();

  const streak = getStreakCount(goals);
  const crushed = getGoalsCrushed(goals);
  const missed = getDaysMissed(goals);

  const handleOpenURL = (url: string) => {
    Linking.openURL(url);
  };

  const handleDeleteAccount = () => {
    console.log('Delete account');
  };

  const formattedTime = (() => {
    if (time instanceof Date && !isNaN(time.getTime())) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return 'Random (7am–11pm)';
  })();

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <Text style={styles.displayName}>User Name</Text>
      </View>

      {/* Current Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Settings</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Tone</Text>
            <Text style={styles.settingValue}>
              {tone === 'soft' ? "I'm soft" : tone === 'tryMe' ? 'Try me' : 'Nuclear'}
            </Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Time Window</Text>
            <Text style={styles.settingValue}>{formattedTime}</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Test Mode</Text>
            <Switch
              value={testMode}
              onValueChange={setTestMode}
              trackColor={{ false: '#2A2A2A', true: '#FF3B3B' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>

        <View style={styles.achievementCard}>
          <View style={styles.achievementRow}>
            <Text style={styles.achievementEmoji}>🔥</Text>
            <Text style={styles.achievementLabel}>Streak</Text>
            <Text style={styles.achievementValue}>{streak} day{streak !== 1 ? 's' : ''}</Text>
          </View>

          <View style={styles.achievementRow}>
            <Text style={styles.achievementEmoji}>💪</Text>
            <Text style={styles.achievementLabel}>Goals Crushed</Text>
            <Text style={styles.achievementValue}>{crushed}</Text>
          </View>

          <View style={styles.achievementRow}>
            <Text style={styles.achievementEmoji}>🥶</Text>
            <Text style={styles.achievementLabel}>Days Missed</Text>
            <Text style={styles.achievementValue}>{missed}</Text>
          </View>
        </View>
      </View>

      {/* Legal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>

        <View style={styles.legalCard}>
          <TouchableOpacity
            style={styles.legalButton}
            onPress={() => handleOpenURL('https://example.com/privacy')}
          >
            <Text style={styles.legalButtonText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.legalButton}
            onPress={() => handleOpenURL('https://example.com/terms')}
          >
            <Text style={styles.legalButtonText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>

        <View style={styles.appInfoCard}>
          <Text style={styles.versionText}>
            Version {Constants.expoConfig?.version || '1.0.0'}
          </Text>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1F1F1F',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 40,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  settingValue: {
    fontSize: 16,
    color: '#888888',
  },
  achievementCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  achievementEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementLabel: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  achievementValue: {
    fontSize: 16,
    color: '#888888',
  },
  legalCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
  },
  legalButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  legalButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  appInfoCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF3B3B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
