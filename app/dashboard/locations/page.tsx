"use client";

import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  useMap,
} from "@/components/ui/map";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocationCard } from "@/components/card-block/location-card";
import { MapPinIcon } from "lucide-react";
import { Location, locations } from "@/mocks/location-mock";
import { universityLocations } from "@/mocks/univerity-mock";

// Helper component to handle flyTo when coordinates change
function MapFlyTo({
  coordinates,
}: {
  coordinates: Location["coordinates"] | null;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (map && isLoaded && coordinates) {
      map.flyTo({
        center: [coordinates.lng, coordinates.lat],
        zoom: 14,
        duration: 1500,
      });
    }
  }, [map, isLoaded, coordinates]);

  return null;
}

const LocationsPage = () => {
  const locationList: Location[] = [...locations, ...universityLocations];

  const [coordinates, setCoordinates] = useState<
    Location["coordinates"] | null
  >(null);

  // Default center (Paris)
  const initialCenter = useMemo<[number, number]>(() => [2.3522, 48.8566], []);

  const handleGetCoordinates = useCallback(
    (coords: Location["coordinates"]) => {
      setCoordinates(coords);
    },
    []
  );

  return (
    <SidebarInsetContent isShowSidebarInsetHeader={false} className="p-0">
      <div className="relative overflow-hidden">
        <Card className="min-w-1/3 absolute h-full top-0 left-0 my-2 z-10 p-0">
          <CardContent className="p-0">
            <ScrollArea className="h-dvh w-full ">
              <div className="p-2 space-y-4">
                {locationList.map((location: Location, index: number) => {
                  return (
                    <LocationCard
                      key={index}
                      icon={MapPinIcon}
                      onClick={() => setCoordinates(location.coordinates)}
                      className="max-w-sm  "
                      location={location}
                      handleGetCoordinates={handleGetCoordinates}
                    />
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="h-dvh p-0 overflow-hidden">
          <Map center={initialCenter} zoom={11}>
            <MapFlyTo coordinates={coordinates} />
            <MapControls
              showCompass
              showZoom
              showFullscreen
              position="bottom-right"
              showLocate
              onLocate={(coords) => {
                setCoordinates({ lat: coords.latitude, lng: coords.longitude });
              }}
            />

            {locationList.map((location: Location, index: number) => {
              const isSelected =
                coordinates?.lat === location.coordinates.lat &&
                coordinates?.lng === location.coordinates.lng;

              return (
                <MapMarker
                  longitude={location.coordinates.lng}
                  latitude={location.coordinates.lat}
                  key={index}
                >
                  <MarkerContent key={index}>
                    <MapPinIcon
                      className={`${
                        isSelected ? "text-red-500 scale-125" : "text-white"
                      } transition-all duration-300`}
                    />
                  </MarkerContent>

                  <MarkerPopup className=" bg-transparent border-none p-0 ">
                    <LocationCard
                      icon={MapPinIcon}
                      location={location}
                      handleGetCoordinates={() => {}}
                      className="w-96"
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
