import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Card, Button, ProgressBar, Chip, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { routeOptimizationService, OptimizedRoute } from '../services/routeOptimizationService';
import { deliveryTrackingService, DeliveryProgress, DeliveryMilestone } from '../services/deliveryTrackingService';

const { width, height } = Dimensions.get('window');

interface EnhancedTrackingScreenProps {
  routeId: string;
  onBack: () => void;
}

const EnhancedTrackingScreen: React.FC<EnhancedTrackingScreenProps> = ({ routeId, onBack }) => {
  const [route, setRoute] = useState<OptimizedRoute | null>(null);
  const [deliveryProgress, setDeliveryProgress] = useState<DeliveryProgress | null>(null);
  const [milestones, setMilestones] = useState<DeliveryMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    initializeTracking();
    return () => {
      // Cleanup when component unmounts
      deliveryTrackingService.stopTracking();
    };
  }, []);

  const initializeTracking = async () => {
    try {
      setLoading(true);
      
      // Get route details
      const routeData = await routeOptimizationService.getRoute(routeId);
      setRoute(routeData);

      // Start delivery tracking
      const progress = await deliveryTrackingService.startTracking(routeData);
      setDeliveryProgress(progress);

      // Set up milestone listener
      deliveryTrackingService.addMilestoneListener((milestone: DeliveryMilestone) => {
        setMilestones(prev => [...prev, milestone]);
        
        // Update delivery progress
        const currentDelivery = deliveryTrackingService.getCurrentDelivery();
        if (currentDelivery) {
          setDeliveryProgress(currentDelivery);
        }
      });

    } catch (err) {
      console.error('Failed to initialize tracking:', err);
      setError('Failed to start delivery tracking');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteStop = async (stopIndex: number) => {
    if (deliveryProgress) {
      try {
        await routeOptimizationService.completeStop(deliveryProgress.deliveryId, stopIndex);
        Alert.alert('Success', 'Stop marked as completed');
      } catch (error) {
        Alert.alert('Error', 'Failed to complete stop');
      }
    }
  };

  const handleCompleteDelivery = async () => {
    if (deliveryProgress) {
      try {
        await routeOptimizationService.completeDelivery(deliveryProgress.deliveryId);
        Alert.alert('Success', 'Delivery completed successfully');
        onBack();
      } catch (error) {
        Alert.alert('Error', 'Failed to complete delivery');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return COLORS.SUCCESS;
      case 'completed': return COLORS.PRIMARY;
      case 'cancelled': return COLORS.ERROR;
      default: return COLORS.GRAY;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bicycle';
      case 'completed': return 'checkmark-circle';
      case 'cancelled': return 'close-circle';
      default: return 'time';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Initializing delivery tracking...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={COLORS.ERROR} />
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={initializeTracking}>
          Retry
        </Button>
      </View>
    );
  }

  if (!route || !deliveryProgress) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No delivery data available</Text>
        <Button mode="contained" onPress={onBack}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={onBack} />
        <Text style={styles.headerTitle}>Delivery Tracking</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <Card.Content>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Delivery Progress</Text>
              <Chip 
                icon={getStatusIcon('in_progress')} 
                style={[styles.statusChip, { backgroundColor: getStatusColor('in_progress') }]}
              >
                In Progress
              </Chip>
            </View>
            
            <ProgressBar 
              progress={deliveryProgress.progress / 100} 
              color={COLORS.PRIMARY}
              style={styles.progressBar}
            />
            
            <Text style={styles.progressText}>
              {deliveryProgress.currentStop} of {deliveryProgress.totalStops} stops completed
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={20} color={COLORS.PRIMARY} />
                <Text style={styles.statText}>
                  {Math.round(deliveryProgress.estimatedTimeRemaining)} min
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="location" size={20} color={COLORS.PRIMARY} />
                <Text style={styles.statText}>
                  {deliveryProgress.distanceRemaining.toFixed(1)} km
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Map */}
        <Card style={styles.mapCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Live Tracking</Text>
            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: deliveryProgress.currentLocation.latitude,
                  longitude: deliveryProgress.currentLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
              >
                {/* Current location marker */}
                <Marker
                  coordinate={deliveryProgress.currentLocation}
                  title="Current Location"
                  description="Delivery agent location"
                >
                  <View style={styles.currentLocationMarker}>
                    <Ionicons name="bicycle" size={20} color={COLORS.WHITE} />
                  </View>
                </Marker>

                {/* Route stops */}
                {route.optimized_route.map((stop, index) => (
                  <Marker
                    key={index}
                    coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                    title={`Stop ${index + 1}`}
                    description={stop.address}
                  >
                    <View style={[
                      styles.stopMarker,
                      { backgroundColor: deliveryProgress.completedStops.includes(index) ? COLORS.SUCCESS : COLORS.PRIMARY }
                    ]}>
                      <Text style={styles.stopNumber}>{index + 1}</Text>
                    </View>
                  </Marker>
                ))}

                {/* Route polyline */}
                <Polyline
                  coordinates={route.optimized_route.map(stop => ({
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                  }))}
                  strokeColor={COLORS.PRIMARY}
                  strokeWidth={3}
                />
              </MapView>
            </View>
          </Card.Content>
        </Card>

        {/* Route Stops */}
        <Card style={styles.stopsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Delivery Route</Text>
            {route.optimized_route.map((stop, index) => (
              <View key={index} style={styles.stopItem}>
                <View style={styles.stopInfo}>
                  <View style={[
                    styles.stopNumber,
                    { backgroundColor: deliveryProgress.completedStops.includes(index) ? COLORS.SUCCESS : COLORS.PRIMARY }
                  ]}>
                    <Text style={styles.stopNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stopDetails}>
                    <Text style={styles.stopAddress}>{stop.address}</Text>
                    <Text style={styles.stopStatus}>
                      {deliveryProgress.completedStops.includes(index) ? 'Completed' : 'Pending'}
                    </Text>
                  </View>
                </View>
                {!deliveryProgress.completedStops.includes(index) && index === deliveryProgress.currentStop && (
                  <Button
                    mode="contained"
                    onPress={() => handleCompleteStop(index)}
                    style={styles.completeButton}
                  >
                    Complete
                  </Button>
                )}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Milestones */}
        <Card style={styles.milestonesCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Recent Updates</Text>
            {milestones.slice(-5).reverse().map((milestone, index) => (
              <View key={index} style={styles.milestoneItem}>
                <Ionicons 
                  name={getStatusIcon(milestone.type)} 
                  size={20} 
                  color={getStatusColor(milestone.type)} 
                />
                <View style={styles.milestoneDetails}>
                  <Text style={styles.milestoneTitle}>
                    {milestone.type.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.milestoneTime}>
                    {new Date(milestone.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Complete Delivery Button */}
        {deliveryProgress.progress === 100 && (
          <Button
            mode="contained"
            onPress={handleCompleteDelivery}
            style={styles.completeDeliveryButton}
            contentStyle={styles.completeDeliveryButtonContent}
          >
            Complete Delivery
          </Button>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.TEXT,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.ERROR,
    textAlign: 'center',
    marginVertical: 16,
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
  progressCard: {
    marginBottom: 16,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  statusChip: {
    backgroundColor: COLORS.SUCCESS,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  mapCard: {
    marginBottom: 16,
    elevation: 2,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  currentLocationMarker: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopMarker: {
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopNumber: {
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopNumberText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 12,
  },
  stopsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  stopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stopDetails: {
    marginLeft: 12,
    flex: 1,
  },
  stopAddress: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  stopStatus: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  completeButton: {
    marginLeft: 8,
  },
  milestonesCard: {
    marginBottom: 16,
    elevation: 2,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  milestoneDetails: {
    marginLeft: 12,
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  milestoneTime: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 2,
  },
  completeDeliveryButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  completeDeliveryButtonContent: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 16,
  },
});

export default EnhancedTrackingScreen;
