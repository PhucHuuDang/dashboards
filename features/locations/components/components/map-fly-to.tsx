"use client";
import { useEffect } from "react";

import { useMap } from "@/components/ui/map";
import { Location } from "@/features/locations/mocks/location-mock";

export function MapFlyTo({
  coordinates,
  disabled,
}: {
  coordinates: Location["coordinates"] | null;
  disabled?: boolean;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !coordinates || disabled) return;

    map.flyTo({
      center: [coordinates.lng, coordinates.lat],
      zoom: 14,
      duration: 1500,
    });
  }, [map, isLoaded, coordinates, disabled]);

  return null;
}
