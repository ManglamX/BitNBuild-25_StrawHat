import axios from 'axios';
import io, { Socket } from 'socket.io-client';

// Route Optimization Service Configuration
const ROUTE_OPTIMIZATION_BASE_URL = 'http://localhost:5001';
const SOCKET_URL = 'http://localhost:5001';

export interface OptimizedRoute {
  route_id: string;
  optimized_route: RouteStop[];
  total_distance: number;
  estimated_time: number;
  status: string;
}

export interface RouteStop {
  address: string;
  latitude: number;
  longitude: number;
  stop_index: number;
  estimated_arrival?: string;
  completed?: boolean;
}

export interface DeliveryTracking {
  delivery_id: string;
  route_id: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  current_location: {
    latitude: number;
    longitude: number;
  };
  completed_stops: number[];
  started_at: string;
  completed_at?: string;
}

export interface LocationUpdate {
  delivery_id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
}

export interface StopCompleted {
  delivery_id: string;
  stop_index: number;
  timestamp: string;
}

export interface DeliveryCompleted {
  delivery_id: string;
  route_id: string;
  timestamp: string;
}

class RouteOptimizationService {
  private socket: Socket | null = null;
  private isConnected = false;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.socket.on('connect', () => {
        console.log('Connected to route optimization service');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from route optimization service');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  /**
   * Optimize delivery route for given addresses
   */
  async optimizeRoute(addresses: string[], startLocation?: string): Promise<OptimizedRoute> {
    try {
      const response = await axios.post(`${ROUTE_OPTIMIZATION_BASE_URL}/optimize-route`, {
        addresses,
        start_location: startLocation
      });

      return response.data;
    } catch (error) {
      console.error('Route optimization failed:', error);
      throw new Error('Failed to optimize route');
    }
  }

  /**
   * Get route details by ID
   */
  async getRoute(routeId: string): Promise<OptimizedRoute> {
    try {
      const response = await axios.get(`${ROUTE_OPTIMIZATION_BASE_URL}/route/${routeId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get route:', error);
      throw new Error('Failed to get route details');
    }
  }

  /**
   * Start delivery tracking for a route
   */
  async startDelivery(routeId: string): Promise<{ delivery_id: string; status: string }> {
    try {
      const response = await axios.post(`${ROUTE_OPTIMIZATION_BASE_URL}/route/${routeId}/start`);
      return response.data;
    } catch (error) {
      console.error('Failed to start delivery:', error);
      throw new Error('Failed to start delivery tracking');
    }
  }

  /**
   * Update delivery agent location
   */
  async updateLocation(deliveryId: string, location: { latitude: number; longitude: number }): Promise<void> {
    try {
      await axios.post(`${ROUTE_OPTIMIZATION_BASE_URL}/track/update`, {
        delivery_id: deliveryId,
        location
      });
    } catch (error) {
      console.error('Failed to update location:', error);
      throw new Error('Failed to update location');
    }
  }

  /**
   * Mark a delivery stop as completed
   */
  async completeStop(deliveryId: string, stopIndex: number): Promise<void> {
    try {
      await axios.post(`${ROUTE_OPTIMIZATION_BASE_URL}/delivery/${deliveryId}/complete-stop`, {
        stop_index: stopIndex
      });
    } catch (error) {
      console.error('Failed to complete stop:', error);
      throw new Error('Failed to complete stop');
    }
  }

  /**
   * Mark entire delivery as completed
   */
  async completeDelivery(deliveryId: string): Promise<void> {
    try {
      await axios.post(`${ROUTE_OPTIMIZATION_BASE_URL}/delivery/${deliveryId}/complete`);
    } catch (error) {
      console.error('Failed to complete delivery:', error);
      throw new Error('Failed to complete delivery');
    }
  }

  /**
   * Join a specific delivery for real-time updates
   */
  joinDelivery(deliveryId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_delivery', { delivery_id: deliveryId });
    }
  }

  /**
   * Leave a specific delivery
   */
  leaveDelivery(deliveryId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_delivery', { delivery_id: deliveryId });
    }
  }

  /**
   * Subscribe to location updates for a delivery
   */
  onLocationUpdate(callback: (data: LocationUpdate) => void): void {
    if (this.socket) {
      this.socket.on('location-update', callback);
    }
  }

  /**
   * Subscribe to stop completion updates
   */
  onStopCompleted(callback: (data: StopCompleted) => void): void {
    if (this.socket) {
      this.socket.on('stop-completed', callback);
    }
  }

  /**
   * Subscribe to delivery completion updates
   */
  onDeliveryCompleted(callback: (data: DeliveryCompleted) => void): void {
    if (this.socket) {
      this.socket.on('delivery-completed', callback);
    }
  }

  /**
   * Subscribe to delivery joined confirmation
   */
  onDeliveryJoined(callback: (data: { delivery_id: string }) => void): void {
    if (this.socket) {
      this.socket.on('joined_delivery', callback);
    }
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  /**
   * Disconnect from the socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Check if socket is connected
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Reconnect to the socket
   */
  reconnect(): void {
    this.disconnect();
    this.initializeSocket();
  }
}

// Export singleton instance
export const routeOptimizationService = new RouteOptimizationService();
export default routeOptimizationService;
