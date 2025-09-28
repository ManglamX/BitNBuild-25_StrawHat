import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Card, Button, Chip, IconButton, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { routeOptimizationService, OptimizedRoute } from '../services/routeOptimizationService';

interface Address {
  id: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

interface RouteOptimizationScreenProps {
  onBack: () => void;
}

const RouteOptimizationScreen: React.FC<RouteOptimizationScreenProps> = ({ onBack }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [startLocation, setStartLocation] = useState('');
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  const addAddress = () => {
    if (newAddress.trim()) {
      const address: Address = {
        id: Date.now().toString(),
        address: newAddress.trim(),
      };
      setAddresses(prev => [...prev, address]);
      setNewAddress('');
    }
  };

  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const optimizeRoute = async () => {
    if (addresses.length < 2) {
      Alert.alert('Error', 'Please add at least 2 addresses to optimize the route');
      return;
    }

    try {
      setLoading(true);
      const addressList = addresses.map(addr => addr.address);
      const result = await routeOptimizationService.optimizeRoute(addressList, startLocation);
      setOptimizedRoute(result);
      Alert.alert('Success', 'Route optimized successfully!');
    } catch (error) {
      console.error('Route optimization failed:', error);
      Alert.alert('Error', 'Failed to optimize route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startDelivery = async () => {
    if (!optimizedRoute) {
      Alert.alert('Error', 'No optimized route available');
      return;
    }

    try {
      setLoading(true);
      const deliveryResponse = await routeOptimizationService.startDelivery(optimizedRoute.route_id);
      Alert.alert('Success', 'Delivery started successfully!', [
        { text: 'OK', onPress: () => onBack() }
      ]);
    } catch (error) {
      console.error('Failed to start delivery:', error);
      Alert.alert('Error', 'Failed to start delivery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAddressItem = ({ item }: { item: Address }) => (
    <Card style={styles.addressCard}>
      <Card.Content>
        <View style={styles.addressItem}>
          <View style={styles.addressInfo}>
            <Text style={styles.addressText}>{item.address}</Text>
            {item.latitude && item.longitude && (
              <Text style={styles.coordinatesText}>
                {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
              </Text>
            )}
          </View>
          <IconButton
            icon="close"
            size={20}
            onPress={() => removeAddress(item.id)}
            iconColor={COLORS.ERROR}
          />
        </View>
      </Card.Content>
    </Card>
  );

  const renderOptimizedStop = ({ item, index }: { item: any; index: number }) => (
    <Card style={styles.stopCard}>
      <Card.Content>
        <View style={styles.stopItem}>
          <View style={styles.stopNumber}>
            <Text style={styles.stopNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.stopDetails}>
            <Text style={styles.stopAddress}>{item.address}</Text>
            <Text style={styles.stopCoordinates}>
              {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={onBack} />
        <Text style={styles.headerTitle}>Route Optimization</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Start Location */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Start Location (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter start location (e.g., Central Kitchen)"
              value={startLocation}
              onChangeText={setStartLocation}
              placeholderTextColor={COLORS.GRAY}
            />
          </Card.Content>
        </Card>

        {/* Add Address */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Delivery Addresses</Text>
            <View style={styles.addAddressContainer}>
              <TextInput
                style={styles.addressInput}
                placeholder="Enter delivery address"
                value={newAddress}
                onChangeText={setNewAddress}
                placeholderTextColor={COLORS.GRAY}
                multiline
              />
              <Button
                mode="contained"
                onPress={addAddress}
                style={styles.addButton}
                disabled={!newAddress.trim()}
              >
                Add
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Address List */}
        {addresses.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                Addresses ({addresses.length})
              </Text>
              <FlatList
                data={addresses}
                renderItem={renderAddressItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </Card.Content>
          </Card>
        )}

        {/* Optimize Button */}
        {addresses.length >= 2 && (
          <Button
            mode="contained"
            onPress={optimizeRoute}
            loading={loading}
            disabled={loading}
            style={styles.optimizeButton}
            contentStyle={styles.optimizeButtonContent}
          >
            Optimize Route
          </Button>
        )}

        {/* Optimized Route */}
        {optimizedRoute && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.routeHeader}>
                <Text style={styles.sectionTitle}>Optimized Route</Text>
                <Chip icon="checkmark" style={styles.successChip}>
                  Optimized
                </Chip>
              </View>
              
              <View style={styles.routeStats}>
                <View style={styles.statItem}>
                  <Ionicons name="location" size={20} color={COLORS.PRIMARY} />
                  <Text style={styles.statText}>
                    {optimizedRoute.total_distance.toFixed(2)} km
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time" size={20} color={COLORS.PRIMARY} />
                  <Text style={styles.statText}>
                    {Math.round(optimizedRoute.estimated_time)} min
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="stop" size={20} color={COLORS.PRIMARY} />
                  <Text style={styles.statText}>
                    {optimizedRoute.optimized_route.length} stops
                  </Text>
                </View>
              </View>

              <FlatList
                data={optimizedRoute.optimized_route}
                renderItem={renderOptimizedStop}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
              />

              <Button
                mode="contained"
                onPress={startDelivery}
                loading={loading}
                disabled={loading}
                style={styles.startDeliveryButton}
                contentStyle={styles.startDeliveryButtonContent}
              >
                Start Delivery
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.PRIMARY,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  headerRight: {
    width: 48,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.TEXT,
    backgroundColor: COLORS.WHITE,
  },
  addAddressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  addressInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.TEXT,
    backgroundColor: COLORS.WHITE,
    marginRight: 8,
    minHeight: 50,
  },
  addButton: {
    marginLeft: 8,
  },
  addressCard: {
    marginBottom: 8,
    elevation: 1,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  optimizeButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  optimizeButtonContent: {
    paddingVertical: 8,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  successChip: {
    backgroundColor: COLORS.SUCCESS,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  stopCard: {
    marginBottom: 8,
    elevation: 1,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopNumberText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 12,
  },
  stopDetails: {
    flex: 1,
  },
  stopAddress: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  stopCoordinates: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  startDeliveryButton: {
    marginTop: 16,
  },
  startDeliveryButtonContent: {
    paddingVertical: 8,
  },
});

export default RouteOptimizationScreen;
