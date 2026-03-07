"use client";
import { useMemo } from "react";

import dynamic from "next/dynamic";

import { Map3DBuildings } from "@/components/ui/map";
import { useLocationContext } from "@/features/locations/contexts/location-context";

import { LocationMarkers } from "./location-marker";
import { MapFlyTo } from "./map-fly-to";
import { UserLocationMarker } from "./user-location-marker";

const Map = dynamic(() => import("@/components/ui/map").then((m) => m.Map), {
  ssr: false,
});
const MapControls = dynamic(
  () => import("@/components/ui/map").then((m) => m.MapControls),
  { ssr: false },
);
const MapRoute = dynamic(
  () => import("@/components/ui/map").then((m) => m.MapRoute),
  { ssr: false },
);

export function LocationsMap() {
  const { state, actions } = useLocationContext();
  const { selectedCoordinates, routeCoordinates, myLocation } = state;
  const { handleLocate } = actions;
  const initialCenter = useMemo<[number, number]>(
    () =>
      myLocation.latitude && myLocation.longitude
        ? [myLocation.longitude, myLocation.latitude]
        : [2.3522, 48.8566],
    [myLocation.latitude, myLocation.longitude],
  );

  return (
    <Map
      showToggleTheme
      center={initialCenter}
      zoom={15.5}
      pitch={45}
      bearing={-17.6}
    >
      <Map3DBuildings />
      <MapFlyTo
        coordinates={selectedCoordinates}
        disabled={routeCoordinates.length > 0}
      />

      <MapRoute
        coordinates={routeCoordinates}
        color="#3b82f6"
        width={5}
        opacity={0.85}
      />

      <MapControls
        showCompass
        showZoom
        showFullscreen
        showLocate
        position="bottom-right"
        onLocate={handleLocate}
      />

      <UserLocationMarker
        latitude={myLocation?.latitude as number}
        longitude={myLocation?.longitude as number}
      />

      <LocationMarkers />
    </Map>
  );
}
