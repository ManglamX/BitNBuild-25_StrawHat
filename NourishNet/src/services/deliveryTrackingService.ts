import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { routeOptimizationService, OptimizedRoute, DeliveryTracking, LocationUpdate } from './routeOptimizationService';

export interface DeliveryProgress {
  deliveryId: string;
  routeId: string;
  currentStop: number;
  totalStops: number;
  progress: number; // 0-100
  estimatedTimeRemaining: number; // in minutes
  distanceRemaining: number; // in km
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  nextStop: {
    address: string;
    latitude: number;
    longitude: number;
    estimatedArrival: string;
  };
  completedStops: number[];
}

export interface DeliveryMilestone {
  type: 'started' | 'stop_completed' | 'delivery_completed' | 'location_update';
  deliveryId: string;
  timestamp: string;
  data: any;
}

class DeliveryTrackingService {
  private currentDelivery: DeliveryProgress | null = null;
  private locationSubscription: Location.LocationSubscription | null = null;
  private isTracking = false;
  private milestones: DeliveryMilestone[] = [];
  private listeners: ((milestone: DeliveryMilestone) => void)[] = [];

  constructor() {
    this.setupNotificationHandlers();
    this.setupRouteOptimizationListeners();
  }

  private setupNotificationHandlers() {
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  private setupRouteOptimizationListeners() {
    // Listen for location updates from delivery agent
    routeOptimizationService.onLocationUpdate((data: LocationUpdate) => {
      this.handleLocationUpdate(data);
    });

    // Listen for stop completion
    routeOptimizationService.onStopCompleted((data) => {
      this.handleStopCompleted(data);
    });

    // Listen for delivery completion
    routeOptimizationService.onDeliveryCompleted((data) => {
      this.handleDeliveryCompleted(data);
    });
  }

  /**
   * Start tracking a delivery
   */
  async startTracking(route: OptimizedRoute): Promise<DeliveryProgress> {
    try {
      // Start delivery in the route optimization service
      const deliveryResponse = await routeOptimizationService.startDelivery(route.route_id);
      
      // Join the delivery for real-time updates
      routeOptimizationService.joinDelivery(deliveryResponse.delivery_id);

      // Create delivery progress object
      this.currentDelivery = {
        deliveryId: deliveryResponse.delivery_id,
        routeId: route.route_id,
        currentStop: 0,
        totalStops: route.optimized_route.length,
        progress: 0,
        estimatedTimeRemaining: route.estimated_time,
        distanceRemaining: route.total_distance,
        currentLocation: {
          latitude: route.optimized_route[0]?.latitude || 0,
          longitude: route.optimized_route[0]?.longitude || 0,
        },
        nextStop: {
          address: route.optimized_route[0]?.address || '',
          latitude: route.optimized_route[0]?.latitude || 0,
          longitude: route.optimized_route[0]?.longitude || 0,
          estimatedArrival: new Date(Date.now() + route.estimated_time * 60000).toISOString(),
        },
        completedStops: [],
      };

      this.isTracking = true;
      this.milestones = [];

      // Start location tracking
      await this.startLocationTracking();

      // Send delivery started milestone
      this.addMilestone({
        type: 'started',
        deliveryId: deliveryResponse.delivery_id,
        timestamp: new Date().toISOString(),
        data: { route: route.route_id }
      });

      // Send notification
      await this.sendNotification(
        'Delivery Started',
        'Your order is now being prepared and will be out for delivery soon!'
      );

      return this.currentDelivery;
    } catch (error) {
      console.error('Failed to start tracking:', error);
      throw new Error('Failed to start delivery tracking');
    }
  }

  /**
   * Stop tracking the current delivery
   */
  async stopTracking(): Promise<void> {
    if (this.currentDelivery) {
      // Leave the delivery room
      routeOptimizationService.leaveDelivery(this.currentDelivery.deliveryId);
      
      // Stop location tracking
      if (this.locationSubscription) {
        this.locationSubscription.remove();
        this.locationSubscription = null;
      }

      this.isTracking = false;
      this.currentDelivery = null;
    }
  }

  /**
   * Get current delivery progress
   */
  getCurrentDelivery(): DeliveryProgress | null {
    return this.currentDelivery;
  }

  /**
   * Get delivery milestones
   */
  getMilestones(): DeliveryMilestone[] {
    return this.milestones;
  }

  /**
   * Add milestone listener
   */
  addMilestoneListener(listener: (milestone: DeliveryMilestone) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove milestone listener
   */
  removeMilestoneListener(listener: (milestone: DeliveryMilestone) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Start location tracking
   */
  private async startLocationTracking(): Promise<void> {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      // Start watching position
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 30000, // Update every 30 seconds
          distanceInterval: 100, // Update every 100 meters
        },
        (location) => {
          this.handleLocationChange(location);
        }
      );
    } catch (error) {
      console.error('Failed to start location tracking:', error);
    }
  }

  /**
   * Handle location change from device GPS
   */
  private async handleLocationChange(location: Location.LocationObject): Promise<void> {
    if (this.currentDelivery && this.isTracking) {
      // Update current location
      this.currentDelivery.currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Send location update to route optimization service
      try {
        await routeOptimizationService.updateLocation(
          this.currentDelivery.deliveryId,
          this.currentDelivery.currentLocation
        );
      } catch (error) {
        console.error('Failed to update location:', error);
      }

      // Add milestone
      this.addMilestone({
        type: 'location_update',
        deliveryId: this.currentDelivery.deliveryId,
        timestamp: new Date().toISOString(),
        data: this.currentDelivery.currentLocation
      });
    }
  }

  /**
   * Handle location update from delivery agent
   */
  private handleLocationUpdate(data: LocationUpdate): void {
    if (this.currentDelivery && this.currentDelivery.deliveryId === data.delivery_id) {
      // Update delivery progress with new location
      this.currentDelivery.currentLocation = data.location;
      
      // Recalculate progress and ETA
      this.updateProgress();
    }
  }

  /**
   * Handle stop completion
   */
  private async handleStopCompleted(data: any): Promise<void> {
    if (this.currentDelivery && this.currentDelivery.deliveryId === data.delivery_id) {
      // Update completed stops
      this.currentDelivery.completedStops.push(data.stop_index);
      this.currentDelivery.currentStop = data.stop_index + 1;
      
      // Update progress
      this.updateProgress();

      // Add milestone
      this.addMilestone({
        type: 'stop_completed',
        deliveryId: data.delivery_id,
        timestamp: data.timestamp,
        data: { stopIndex: data.stop_index }
      });

      // Send notification
      await this.sendNotification(
        'Stop Completed',
        `Delivery completed at stop ${data.stop_index + 1} of ${this.currentDelivery.totalStops}`
      );
    }
  }

  /**
   * Handle delivery completion
   */
  private async handleDeliveryCompleted(data: any): Promise<void> {
    if (this.currentDelivery && this.currentDelivery.deliveryId === data.delivery_id) {
      // Mark delivery as completed
      this.currentDelivery.progress = 100;
      this.currentDelivery.estimatedTimeRemaining = 0;
      this.currentDelivery.distanceRemaining = 0;

      // Add milestone
      this.addMilestone({
        type: 'delivery_completed',
        deliveryId: data.delivery_id,
        timestamp: data.timestamp,
        data: { routeId: data.route_id }
      });

      // Send completion notification
      await this.sendNotification(
        'Delivery Completed',
        'Your order has been successfully delivered!'
      );

      // Stop tracking
      await this.stopTracking();
    }
  }

  /**
   * Update delivery progress
   */
  private updateProgress(): void {
    if (this.currentDelivery) {
      // Calculate progress percentage
      this.currentDelivery.progress = Math.round(
        (this.currentDelivery.completedStops.length / this.currentDelivery.totalStops) * 100
      );

      // Update next stop
      const nextStopIndex = this.currentDelivery.currentStop;
      if (nextStopIndex < this.currentDelivery.totalStops) {
        // This would need to be populated from the route data
        // For now, we'll use placeholder data
        this.currentDelivery.nextStop = {
          address: `Stop ${nextStopIndex + 1}`,
          latitude: 0,
          longitude: 0,
          estimatedArrival: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
        };
      }
    }
  }

  /**
   * Add milestone and notify listeners
   */
  private addMilestone(milestone: DeliveryMilestone): void {
    this.milestones.push(milestone);
    this.listeners.forEach(listener => listener(milestone));
  }

  /**
   * Send push notification
   */
  private async sendNotification(title: string, body: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  /**
   * Calculate ETA to next stop
   */
  calculateETA(currentLocation: { latitude: number; longitude: number }, nextStop: { latitude: number; longitude: number }): number {
    // Simple distance calculation (in a real app, you'd use a proper routing service)
    const distance = this.calculateDistance(currentLocation, nextStop);
    const averageSpeed = 25; // km/h
    return (distance / averageSpeed) * 60; // Return in minutes
  }

  /**
   * Calculate distance between two points
   */
  private calculateDistance(point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) * Math.cos(this.toRadians(point2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Export singleton instance
export const deliveryTrackingService = new DeliveryTrackingService();
export default deliveryTrackingService;
