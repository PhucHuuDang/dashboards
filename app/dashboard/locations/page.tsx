"use client";

import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Card, CardContent } from "@/components/ui/card";
// import {
//   Map,
//   MapControls,
//   MapMarker,
//   MapRoute,
//   MarkerContent,
//   MarkerPopup,
//   useMap,
// } from "@/components/ui/map";

import { ScrollArea } from "@/components/ui/scroll-area";
import { LocationCard } from "@/components/card-block/location-card";
import { MapPinIcon, Navigation } from "lucide-react";
import { Location, locations } from "@/mocks/location-mock";
import { universityLocations } from "@/mocks/univerity-mock";

import { useGeolocation } from "react-use";
import { CinematicThemeSwitcher } from "@/components/ui/cinematic-theme-switcher";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import MagnifierIcon from "@/components/ui/magnifier-icon";
import { InputGroup } from "@/components/ui/input-group";
import { LocationListSearch } from "@/components/segments/locations/location-list-search";
import dynamic from "next/dynamic";
import { useMap } from "@/components/ui/map";
import { BlurFade } from "@/components/common/blur-fade";

const Map = dynamic(
  () => import("@/components/ui/map").then((mod) => mod.Map),
  { ssr: false }
);
const MapControls = dynamic(
  () => import("@/components/ui/map").then((mod) => mod.MapControls),
  { ssr: false }
);
const MapMarker = dynamic(
  () => import("@/components/ui/map").then((mod) => mod.MapMarker),
  { ssr: false }
);
const MapRoute = dynamic(
  () => import("@/components/ui/map").then((mod) => mod.MapRoute),
  { ssr: false }
);
const MarkerContent = dynamic(
  () => import("@/components/ui/map").then((mod) => mod.MarkerContent),
  { ssr: false }
);
const MarkerPopup = dynamic(
  () => import("@/components/ui/map").then((mod) => mod.MarkerPopup),
  { ssr: false }
);

const MapComponent = memo(Map);
const MapControlsComponent = memo(MapControls);
const MapMarkerComponent = memo(MapMarker);
const MapRouteComponent = memo(MapRoute);
const MarkerContentComponent = memo(MarkerContent);
const MarkerPopupComponent = memo(MarkerPopup);

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

  // console.log("Fetching route:", { start, end, url });

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
      // console.log("Route coordinates count:", coordinates.length);
      return coordinates;
    }

    // console.warn("No routes found in response:", data);
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

  const [searchQuery, setSearchQuery] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

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

      setRouteCoordinates(route);
      setIsLoadingRoute(false);
    },
    [myLocation.latitude, myLocation.longitude]
  );

  return (
    <SidebarInsetContent isShowSidebarInsetHeader={false} className="p-0">
      <div className="relative overflow-hidden">
        <Card className="min-w-1/3 absolute h-full top-0 left-0 my-2 z-10 p-0">
          <CardContent className="p-0">
            <LocationListSearch
              locationList={locationList}
              handleGetCoordinates={handleGetCoordinates}
              handleRouteToLocation={handleRouteToLocation}
              isLoadingRoute={isLoadingRoute}
              selectedCoordinates={selectedCoordinates}
            />
          </CardContent>
        </Card>

        <Card className="h-dvh p-0 overflow-hidden">
          <MapComponent center={initialCenter} zoom={11} showToggleTheme>
            {/* Disable flyTo when showing route (fitBounds will handle it) */}
            <MapFlyTo
              coordinates={selectedCoordinates}
              disabled={routeCoordinates.length > 0}
            />

            {/* Route line from user location to destination */}
            <MapRouteComponent
              coordinates={routeCoordinates}
              color="#3b82f6"
              width={5}
              opacity={0.85}
            />

            <MapControlsComponent
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
              <MapMarkerComponent
                longitude={myLocation.longitude}
                latitude={myLocation.latitude}
              >
                <MarkerContentComponent>
                  <div className="relative">
                    <div className="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping" />
                    <Navigation className="size-6 text-blue-500 fill-blue-500 rotate-0" />
                  </div>
                </MarkerContentComponent>
              </MapMarkerComponent>
            )}

            {/* Location markers */}
            {locationList.map((location: Location, index: number) => {
              const isSelected =
                selectedCoordinates?.lat === location.coordinates.lat &&
                selectedCoordinates?.lng === location.coordinates.lng;

              return (
                <BlurFade key={index} inView delay={index * 0.03}>
                  <MapMarkerComponent
                    longitude={location.coordinates.lng}
                    latitude={location.coordinates.lat}
                  >
                    <MarkerContentComponent key={index}>
                      <MapPinIcon
                        className={`${
                          isSelected ? "text-primary scale-125" : "text-white"
                        } transition-all duration-300`}
                      />
                    </MarkerContentComponent>

                    <MarkerPopupComponent className="bg-transparent border-none p-0">
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
                          selectedCoordinates?.lat ===
                            location.coordinates.lat &&
                          selectedCoordinates?.lng === location.coordinates.lng
                        }
                      />
                    </MarkerPopupComponent>
                  </MapMarkerComponent>
                </BlurFade>
              );
            })}
          </MapComponent>
        </Card>
      </div>
    </SidebarInsetContent>
  );
};

export default LocationsPage;
