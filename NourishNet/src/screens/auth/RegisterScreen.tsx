import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, VALIDATION } from '../../utils/constants';

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, state } = useAuth();
  const navigation = useNavigation<any>();

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!VALIDATION.PHONE_REGEX.test(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password, phone);
    } catch (error) {
      Alert.alert('Registration Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join NourishNet today</Text>

            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              Create Account
            </Button>

            <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
              Already have an account? Sign In
            </Text>

            {state.error && (
              <Text style={styles.errorText}>{state.error}</Text>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.MD,
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.LG,
    color: COLORS.TEXT_SECONDARY,
  },
  input: {
    marginBottom: SPACING.MD,
  },
  button: {
    marginTop: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  errorText: {
    color: COLORS.ERROR,
    textAlign: 'center',
    marginTop: SPACING.SM,
  },
  linkText: {
    color: COLORS.PRIMARY,
    textAlign: 'center',
    marginTop: SPACING.SM,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
