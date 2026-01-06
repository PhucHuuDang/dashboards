"use client";

import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Map,
  MapControls,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerPopup,
  useMap,
} from "@/components/ui/map";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocationCard } from "@/components/card-block/location-card";
import { MapPinIcon, Navigation } from "lucide-react";
import { Location, locations } from "@/mocks/location-mock";
import { universityLocations } from "@/mocks/univerity-mock";

import { useGeolocation } from "react-use";

type RouteCoordinates = [number, number][];

// Helper component to handle flyTo when coordinates change
function MapFlyTo({
  coordinates,
  disabled = false,
}: {
  coordinates: Location["coordinates"] | null;
  disabled?: boolean;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (map && isLoaded && coordinates && !disabled) {
      map.flyTo({
        center: [coordinates.lng, coordinates.lat],
        zoom: 14,
        duration: 1500,
      });
    }
  }, [map, isLoaded, coordinates, disabled]);

  return null;
}

async function fetchRoute(
  start: [number, number],
  end: [number, number]
): Promise<RouteCoordinates> {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;

  console.log("Fetching route:", { start, end, url });

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Route API error:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log("Route API response:", data);

    if (data.code === "Ok" && data.routes && data.routes.length > 0) {
      const coordinates = data.routes[0].geometry
        .coordinates as RouteCoordinates;
      console.log("Route coordinates count:", coordinates.length);
      return coordinates;
    }

    console.warn("No routes found in response:", data);
    return [];
  } catch (error) {
    console.error("Failed to fetch route:", error);
    return [];
  }
}

// https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson

// https://router.project-osrm.org/route/v1/driving/2.3522,48.8566;2.3522,48.8566?overview=full&geometries=geojson
const LocationsPage = () => {
  const locationList: Location[] = [...locations, ...universityLocations];

  const myLocation = useGeolocation({
    enableHighAccuracy: true,
  });

  const [selectedCoordinates, setSelectedCoordinates] = useState<
    Location["coordinates"] | null
  >(null);

  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinates>(
    []
  );
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Default center (Paris)
  const initialCenter = useMemo<[number, number]>(() => [2.3522, 48.8566], []);

  const handleGetCoordinates = useCallback(
    (coords: Location["coordinates"]) => {
      setSelectedCoordinates(coords);
      // Clear route when just viewing a location
      setRouteCoordinates([]);
    },
    []
  );

  const handleRouteToLocation = useCallback(
    async (destinationCoords: Location["coordinates"]) => {
      if (!myLocation.latitude || !myLocation.longitude) {
        alert("Please enable location access to get directions");
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

      const route = await fetchRoute(start, end);

      console.log({ route });
      // const route: RouteCoordinates = [
      //   [2.3522, 48.8566],
      //   [2.3522, 48.8566],
      // ];
      setRouteCoordinates(route);
      setIsLoadingRoute(false);
    },
    [myLocation.latitude, myLocation.longitude]
  );

  console.log(routeCoordinates);

  return (
    <SidebarInsetContent isShowSidebarInsetHeader={false} className="p-0">
      <div className="relative overflow-hidden">
        <Card className="min-w-1/3 absolute h-full top-0 left-0 my-2 z-10 p-0">
          <CardContent className="p-0">
            <ScrollArea className="h-dvh w-full ">
              <div className="p-2 space-y-2">
                {locationList.map((location: Location, index: number) => {
                  return (
                    <LocationCard
                      key={index}
                      icon={MapPinIcon}
                      onClick={() => handleGetCoordinates(location.coordinates)}
                      className=""
                      location={location}
                      handleGetCoordinates={handleGetCoordinates}
                      handleRouteToLocation={() => {
                        // console.log(object);
                        handleRouteToLocation(location.coordinates);
                      }}
                      isLoadingRoute={
                        isLoadingRoute &&
                        selectedCoordinates?.lat === location.coordinates.lat &&
                        selectedCoordinates?.lng === location.coordinates.lng
                      }
                    />
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="h-dvh p-0 overflow-hidden">
          <Map center={initialCenter} zoom={11}>
            {/* Disable flyTo when showing route (fitBounds will handle it) */}
            <MapFlyTo
              coordinates={selectedCoordinates}
              disabled={routeCoordinates.length > 0}
            />

            {/* Route line from user location to destination */}
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
              position="bottom-right"
              showLocate
              onLocate={(coords) => {
                setSelectedCoordinates({
                  lat: coords.latitude,
                  lng: coords.longitude,
                });
              }}
            />

            {/* User's current location marker */}
            {myLocation.latitude && myLocation.longitude && (
              <MapMarker
                longitude={myLocation.longitude}
                latitude={myLocation.latitude}
              >
                <MarkerContent>
                  <div className="relative">
                    <div className="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping" />
                    <Navigation className="size-6 text-blue-500 fill-blue-500 rotate-0" />
                  </div>
                </MarkerContent>
              </MapMarker>
            )}

            {/* Location markers */}
            {locationList.map((location: Location, index: number) => {
              const isSelected =
                selectedCoordinates?.lat === location.coordinates.lat &&
                selectedCoordinates?.lng === location.coordinates.lng;

              return (
                <MapMarker
                  longitude={location.coordinates.lng}
                  latitude={location.coordinates.lat}
                  key={index}
                >
                  <MarkerContent key={index}>
                    <MapPinIcon
                      className={`${
                        isSelected ? "text-primary scale-125" : "text-white"
                      } transition-all duration-300`}
                    />
                  </MarkerContent>

                  <MarkerPopup className="bg-transparent border-none p-0">
                    <LocationCard
                      icon={MapPinIcon}
                      location={location}
                      handleGetCoordinates={() => {}}
                      className="w-96"
                      handleRouteToLocation={() =>
                        handleRouteToLocation(location.coordinates)
                      }
                      isLoadingRoute={
                        isLoadingRoute &&
                        selectedCoordinates?.lat === location.coordinates.lat &&
                        selectedCoordinates?.lng === location.coordinates.lng
                      }
                    />
                  </MarkerPopup>
                </MapMarker>
              );
            })}
          </Map>
        </Card>
      </div>
    </SidebarInsetContent>
  );
};

export default LocationsPage;
