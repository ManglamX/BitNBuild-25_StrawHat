import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, VALIDATION } from '../../utils/constants';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, state } = useAuth();
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

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
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              Sign In
            </Button>

            <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>
              Don't have an account? Sign Up
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

export default LoginScreen;
