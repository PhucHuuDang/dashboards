"use client";
import dynamic from "next/dynamic";
import { MapFlyTo } from "./map-fly-to";
import { UserLocationMarker } from "./user-location-marker";
import { LocationMarkers } from "./location-marker";
import { Location } from "@/mocks/location-mock";

import { GeoLocationSensorState } from "react-use/lib/useGeolocation";
import { useMemo } from "react";

const Map = dynamic(() => import("@/components/ui/map").then((m) => m.Map), {
  ssr: false,
});
const MapControls = dynamic(
  () => import("@/components/ui/map").then((m) => m.MapControls),
  { ssr: false }
);
const MapRoute = dynamic(
  () => import("@/components/ui/map").then((m) => m.MapRoute),
  { ssr: false }
);

type Props = {
  locations: Location[];
  selectedCoordinates: Location["coordinates"] | null;
  routeCoordinates: [number, number][];
  myLocation: GeoLocationSensorState;
  isLoadingRoute: boolean;
  onRoute: (coords: Location["coordinates"]) => void;
  onLocate: (coords: { latitude: number; longitude: number }) => void;
};

export function LocationsMap({
  locations,
  selectedCoordinates,
  routeCoordinates,
  myLocation,
  isLoadingRoute,
  onRoute,
  onLocate,
}: Props) {
  const initialCenter = useMemo<[number, number]>(
    () =>
      myLocation.latitude && myLocation.longitude
        ? [myLocation.longitude, myLocation.latitude]
        : [2.3522, 48.8566],
    [myLocation.latitude, myLocation.longitude]
  );

  return (
    <Map center={initialCenter} zoom={11} showToggleTheme>
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
        onLocate={onLocate}
      />

      <UserLocationMarker
        latitude={myLocation?.latitude as number}
        longitude={myLocation?.longitude as number}
      />

      <LocationMarkers
        locations={locations}
        selectedCoordinates={selectedCoordinates}
        isLoadingRoute={isLoadingRoute}
        onRoute={onRoute}
      />
    </Map>
  );
}
