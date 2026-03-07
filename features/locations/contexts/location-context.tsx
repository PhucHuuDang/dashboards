"use client";

import { createContext, useContext, ReactNode } from "react";

import { RouteCoordinates } from "@/lib/location-fetch-route";

import type { Location } from "@/features/locations/mocks/location-mock";

export interface LocationState {
  locationList: Location[];
  selectedCoordinates: Location["coordinates"] | null;
  routeCoordinates: RouteCoordinates;
  isLoadingRoute: boolean;
  myLocation: { latitude: number | null; longitude: number | null };
}

export interface LocationActions {
  handleGetCoordinates: (coords: Location["coordinates"]) => void;
  handleRouteToLocation: (
    destinationCoords: Location["coordinates"],
  ) => Promise<void>;
  handleLocate: (coords: { latitude: number; longitude: number }) => void;
}

// Meta is used for refs and other non-state values that don't trigger re-renders
export type LocationMeta = Record<string, unknown>;

export interface LocationContextValue {
  state: LocationState;
  actions: LocationActions;
  meta: LocationMeta;
}

export const LocationContext = createContext<LocationContextValue | null>(null);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider",
    );
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
  state: LocationState;
  actions: LocationActions;
  meta?: LocationMeta;
}

export const LocationProvider = ({
  children,
  state,
  actions,
  meta = {},
}: LocationProviderProps) => {
  return (
    <LocationContext.Provider value={{ state, actions, meta }}>
      {children}
    </LocationContext.Provider>
  );
};
