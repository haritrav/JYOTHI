'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserLocation } from '@/types';

interface LocationContextType {
  location: UserLocation;
  setLocation: (loc: UserLocation) => void;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
  isLocationSet: boolean;
  detectLocation: () => Promise<void>;
  isDetecting: boolean;
}

const DEFAULT_LOCATION: UserLocation = {
  state: 'Tamil Nadu',
  district: 'Madurai',
  block: 'Vadipatti',
  village: 'Vadipatti Town',
  pincode: '625218',
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<UserLocation>(DEFAULT_LOCATION);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [isLocationSet, setIsLocationSet] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('jyothi_user_location');
    if (saved) {
      try {
        setLocationState(JSON.parse(saved));
        setIsLocationSet(true);
      } catch (e) {
        console.error('Failed to parse saved location', e);
      }
    }
  }, []);

  const setLocation = (loc: UserLocation) => {
    setLocationState(loc);
    setIsLocationSet(true);
    localStorage.setItem('jyothi_user_location', JSON.stringify(loc));
  };

  const detectLocation = async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // In real deployment with Google Maps Geocoding API: reverse geocode coordinates.
        // We set approximate district and notify user
        const approximate: UserLocation = {
          state: 'Tamil Nadu',
          district: 'Madurai',
          block: 'Vadipatti',
          village: 'Current Area',
        };
        setLocation(approximate);
        setIsDetecting(false);
        setShowLocationModal(false);
      },
      (err) => {
        console.warn('Geolocation access denied/failed', err);
        setIsDetecting(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        showLocationModal,
        setShowLocationModal,
        isLocationSet,
        detectLocation,
        isDetecting,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
