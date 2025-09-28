import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS, SPACING } from '../../utils/constants';

const SubscriptionDetailScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Subscription Detail Screen - Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MD,
  },
  text: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
  },
});

export default SubscriptionDetailScreen;
