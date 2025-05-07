import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { BrandedLogo } from '../../components/BrandedLogo';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      // Error is already handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <BrandedLogo size="large" />
        </View>
        <Text style={styles.heading}>You're Back...</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors(prev => ({ ...prev, email: undefined }));
              }}
              placeholder="Enter your email"
              placeholderTextColor="#888888"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors(prev => ({ ...prev, password: undefined }));
              }}
              placeholder="Enter your password"
              placeholderTextColor="#888888"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, (!email || !password) && styles.buttonDisabled]}
          disabled={!email || !password || loading}
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, (!email || !password) && styles.buttonTextDisabled]}>
            Log In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => router.push('/auth/register' as any)}
        >
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.link}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  footer: {
    padding: 24,
    backgroundColor: '#1F1F1F',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    gap: 16,
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
  linkContainer: {
    alignItems: 'center',
  },
  linkText: {
    color: '#888888',
    fontSize: 16,
  },
  link: {
    color: '#FF3B3B',
    fontWeight: 'bold',
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  inputError: {
    borderColor: '#FF3B3B',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B3B',
    fontSize: 12,
    marginTop: 4,
  },
});
