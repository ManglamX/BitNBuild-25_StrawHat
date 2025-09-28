import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { COLORS, SPACING } from '../../utils/constants';

const MenuScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Today's Menu</Text>
            <Text style={styles.subtitle}>
              Fresh meals prepared daily by our expert chefs
            </Text>
            <Button mode="contained" style={styles.button}>
              View Full Menu
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Breakfast</Text>
            <Text style={styles.subtitle}>
              Start your day with nutritious breakfast options
            </Text>
            <Button mode="outlined" style={styles.button}>
              View Breakfast
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Lunch</Text>
            <Text style={styles.subtitle}>
              Satisfying lunch meals for your midday energy
            </Text>
            <Button mode="outlined" style={styles.button}>
              View Lunch
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Dinner</Text>
            <Text style={styles.subtitle}>
              Complete your day with wholesome dinner options
            </Text>
            <Button mode="outlined" style={styles.button}>
              View Dinner
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

export default MenuScreen;
