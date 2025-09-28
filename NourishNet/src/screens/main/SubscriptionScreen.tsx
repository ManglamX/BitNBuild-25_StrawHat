import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { COLORS, SPACING } from '../../utils/constants';

const SubscriptionScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Current Subscription</Text>
            <Text style={styles.subtitle}>
              You don't have an active subscription yet
            </Text>
            <Button mode="contained" style={styles.button}>
              Choose a Plan
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Available Plans</Text>
            <Text style={styles.subtitle}>
              Choose the plan that works best for you
            </Text>
            <Button mode="outlined" style={styles.button}>
              View Plans
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Subscription History</Text>
            <Text style={styles.subtitle}>
              View your past subscriptions and orders
            </Text>
            <Button mode="outlined" style={styles.button}>
              View History
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
    padding: SPACING.MD,
  },
  card: {
    marginBottom: SPACING.MD,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
  },
  button: {
    marginTop: SPACING.SM,
  },
});

export default SubscriptionScreen;
