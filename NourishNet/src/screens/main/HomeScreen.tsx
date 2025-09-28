import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING } from '../../utils/constants';

const HomeScreen: React.FC = () => {
  const { state } = useAuth();
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text style={styles.welcomeText}>
              Welcome back, {state.user?.name || 'User'}!
            </Text>
            <Text style={styles.subtitle}>
              Your daily meals are ready to be delivered
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Today's Menu</Text>
            <Text style={styles.cardSubtitle}>
              Fresh and delicious meals prepared just for you
            </Text>
            <Button mode="contained" style={styles.button}>
              View Menu
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Your Subscription</Text>
            <Text style={styles.cardSubtitle}>
              Manage your meal subscription
            </Text>
            <Button mode="outlined" style={styles.button}>
              View Subscription
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Track Delivery</Text>
            <Text style={styles.cardSubtitle}>
              See where your order is
            </Text>
            <Button mode="outlined" style={styles.button}>
              Track Order
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Route Optimization</Text>
            <Text style={styles.cardSubtitle}>
              Optimize delivery routes for maximum efficiency
            </Text>
            <Button 
              mode="contained" 
              style={styles.button}
              onPress={() => navigation.navigate('RouteOptimization' as never)}
            >
              Optimize Routes
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Live Tracking</Text>
            <Text style={styles.cardSubtitle}>
              Real-time delivery tracking with live updates
            </Text>
            <Button 
              mode="outlined" 
              style={styles.button}
              onPress={() => navigation.navigate('EnhancedTracking' as never, { routeId: 'demo-route-123' } as never)}
            >
              Live Tracking Demo
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
  welcomeCard: {
    marginBottom: SPACING.MD,
    backgroundColor: COLORS.PRIMARY,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  card: {
    marginBottom: SPACING.MD,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
  },
  button: {
    marginTop: SPACING.SM,
  },
});

export default HomeScreen;
