"use client";
import { useCallback, useMemo, useState } from "react";

import { useInView } from "react-intersection-observer";
import { useGeolocation } from "react-use";
import { toast } from "sonner";

import {
  locationFetchRoute,
  RouteCoordinates,
} from "@/lib/location-fetch-route";

import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import { Card } from "@/components/ui/card";
import { LocationsMap } from "@/features/locations/components/components/location-map";
import { LocationProvider } from "@/features/locations/contexts/location-context";
import { Location, locations } from "@/features/locations/mocks/location-mock";
import { universityLocations } from "@/features/locations/mocks/univerity-mock";

import { LocationsSidebar } from "./components/location-sidebar";

const LocationsClient = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const locationList = useMemo<Location[]>(
    () => [...locations, ...universityLocations],
    [],
  );

  const myLocation = useGeolocation({
    enableHighAccuracy: true,
  });

  const [selectedCoordinates, setSelectedCoordinates] = useState<
    Location["coordinates"] | null
  >(null);

  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinates>(
    [],
  );
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const handleGetCoordinates = useCallback(
    (coords: Location["coordinates"]) => {
      setSelectedCoordinates(coords);
      // Clear route when just viewing a location
      setRouteCoordinates([]);
    },
    [],
  );

  const handleRouteToLocation = useCallback(
    async (destinationCoords: Location["coordinates"]) => {
      if (!myLocation.latitude || !myLocation.longitude) {
        toast.warning("Please enable location access to get directions");
        return;
      }

      setIsLoadingRoute(true);
      setSelectedCoordinates(destinationCoords);

      const start: [number, number] = [
        myLocation.longitude,
        myLocation.latitude,
      ];
      const end: [number, number] = [
        destinationCoords.lng,
        destinationCoords.lat,
      ];

      const route = await locationFetchRoute(start, end);

      setRouteCoordinates(route);
      setIsLoadingRoute(false);
    },
    [myLocation.latitude, myLocation.longitude],
  );

  const handleLocate = useCallback(
    (coords: { latitude: number; longitude: number }) => {
      setSelectedCoordinates({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    },
    [],
  );

  // useEventListener("keydown", (event) => {
  //   const isModifier = event.ctrlKey || event.metaKey;

  //   console.log(event.key.toLowerCase());

  //   if (isModifier && event.key.toLowerCase() === "b") {
  //     event.preventDefault();
  //     console.log("sidebar");
  //   }
  // });

  return (
    <LocationProvider
      state={{
        locationList,
        selectedCoordinates,
        routeCoordinates,
        isLoadingRoute,
        myLocation: {
          latitude: myLocation.latitude ?? null,
          longitude: myLocation.longitude ?? null,
        },
      }}
      actions={{
        handleGetCoordinates,
        handleRouteToLocation,
        handleLocate,
      }}
    >
      <SidebarInsetContent isShowSidebarInsetHeader={false} className="p-0">
        <div className="relative overflow-hidden">
          <LocationsSidebar />

          <Card className="h-dvh p-0 overflow-hidden" ref={ref}>
            {inView && <LocationsMap />}
          </Card>
        </div>
      </SidebarInsetContent>
    </LocationProvider>
  );
};

export default LocationsClient;
