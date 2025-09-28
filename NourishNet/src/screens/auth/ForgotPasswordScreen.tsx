import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { COLORS, SPACING, VALIDATION } from '../../utils/constants';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement forgot password API call
      Alert.alert('Success', 'Password reset link sent to your email');
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleForgotPassword}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              Send Reset Link
            </Button>
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
});

export default ForgotPasswordScreen;
