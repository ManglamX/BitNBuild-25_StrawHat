import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING } from '../../utils/constants';

const ProfileScreen: React.FC = () => {
  const { state, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.profileCard}>
          <Card.Content>
            <Text style={styles.name}>{state.user?.name || 'User'}</Text>
            <Text style={styles.email}>{state.user?.email || 'user@example.com'}</Text>
            <Text style={styles.phone}>{state.user?.phone || '+91 9876543210'}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Item
              title="Edit Profile"
              description="Update your personal information"
              left={(props) => <List.Icon {...props} icon="account-edit" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="Address Book"
              description="Manage your delivery addresses"
              left={(props) => <List.Icon {...props} icon="map-marker" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="Payment Methods"
              description="Manage your payment options"
              left={(props) => <List.Icon {...props} icon="credit-card" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="Notifications"
              description="Configure notification settings"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="Settings"
              description="App preferences and settings"
              left={(props) => <List.Icon {...props} icon="cog" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
              Logout
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
  profileCard: {
    marginBottom: SPACING.MD,
    elevation: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  email: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  phone: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  card: {
    marginBottom: SPACING.MD,
    elevation: 2,
  },
  logoutButton: {
    marginTop: SPACING.SM,
    borderColor: COLORS.ERROR,
  },
});

export default ProfileScreen;
