import { create } from 'zustand';
import { generateVehicleId, calculateVehicleStatistics } from '../utils/vehicleUtils';

const useVehicleStore = create((set, get) => ({
  vehicles: [],
  selectedVehicleId: null,
  trackingVehicleId: null,
  playbackVehicleId: null,
  isPlaybackActive: false,
  playbackSpeed: 1000,
  playbackIndex: 0,
  alerts: [],

  addVehicle: (vehicleData) => {
    const vehicle = {
      id: generateVehicleId(),
      vehicleNumber: vehicleData.vehicleNumber,
      vehicleName: vehicleData.vehicleName || '',
      trackData: [],
      currentPosition: null,
      isTracking: false,
      lastUpdateTime: null,
      totalDistance: 0,
      averageSpeed: 0,
      createdAt: Date.now(),
    };

    set((state) => ({
      vehicles: [...state.vehicles, vehicle],
    }));

    return vehicle.id;
  },

  updateVehicle: (vehicleId, updates) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId ? { ...v, ...updates } : v
      ),
    }));
  },

  removeVehicle: (vehicleId) => {
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== vehicleId),
      selectedVehicleId:
        state.selectedVehicleId === vehicleId ? null : state.selectedVehicleId,
      trackingVehicleId:
        state.trackingVehicleId === vehicleId ? null : state.trackingVehicleId,
    }));
  },

  selectVehicle: (vehicleId) => {
    set({ selectedVehicleId: vehicleId });
  },

  startTracking: (vehicleId) => {
    set((state) => ({
      trackingVehicleId: vehicleId,
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId
          ? { ...v, isTracking: true, lastUpdateTime: Date.now() }
          : v
      ),
    }));
  },

  stopTracking: (vehicleId) => {
    set((state) => ({
      trackingVehicleId: state.trackingVehicleId === vehicleId ? null : state.trackingVehicleId,
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId ? { ...v, isTracking: false } : v
      ),
    }));
  },

  addTrackPoint: (vehicleId, point) => {
    set((state) => {
      const vehicle = state.vehicles.find((v) => v.id === vehicleId);
      if (!vehicle) return state;

      const newTrackData = [...vehicle.trackData, point];
      const stats = calculateVehicleStatistics(newTrackData);

      return {
        vehicles: state.vehicles.map((v) =>
          v.id === vehicleId
            ? {
                ...v,
                trackData: newTrackData,
                currentPosition: point,
                lastUpdateTime: Date.now(),
                totalDistance: stats.totalDistance,
                averageSpeed: stats.averageSpeed,
              }
            : v
        ),
      };
    });
  },

  clearTrack: (vehicleId) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              trackData: [],
              currentPosition: null,
              totalDistance: 0,
              averageSpeed: 0,
            }
          : v
      ),
    }));
  },

  setTrackData: (vehicleId, trackData) => {
    const stats = calculateVehicleStatistics(trackData);
    
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              trackData,
              currentPosition: trackData.length > 0 ? trackData[trackData.length - 1] : null,
              totalDistance: stats.totalDistance,
              averageSpeed: stats.averageSpeed,
            }
          : v
      ),
    }));
  },

  startPlayback: (vehicleId, speed = 1000) => {
    set({
      playbackVehicleId: vehicleId,
      isPlaybackActive: true,
      playbackSpeed: speed,
      playbackIndex: 0,
    });
  },

  pausePlayback: () => {
    set({ isPlaybackActive: false });
  },

  resumePlayback: () => {
    set({ isPlaybackActive: true });
  },

  stopPlayback: () => {
    set({
      playbackVehicleId: null,
      isPlaybackActive: false,
      playbackIndex: 0,
    });
  },

  setPlaybackSpeed: (speed) => {
    set({ playbackSpeed: speed });
  },

  setPlaybackIndex: (index) => {
    set({ playbackIndex: index });
  },

  addAlert: (alert) => {
    set((state) => ({
      alerts: [...state.alerts, { ...alert, id: Date.now(), timestamp: Date.now() }],
    }));
  },

  removeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
    }));
  },

  clearAlerts: () => {
    set({ alerts: [] });
  },

  getVehicle: (vehicleId) => {
    return get().vehicles.find((v) => v.id === vehicleId);
  },

  getSelectedVehicle: () => {
    const state = get();
    return state.vehicles.find((v) => v.id === state.selectedVehicleId);
  },

  getTrackingVehicle: () => {
    const state = get();
    return state.vehicles.find((v) => v.id === state.trackingVehicleId);
  },

  getPlaybackVehicle: () => {
    const state = get();
    return state.vehicles.find((v) => v.id === state.playbackVehicleId);
  },
}));

export default useVehicleStore;
