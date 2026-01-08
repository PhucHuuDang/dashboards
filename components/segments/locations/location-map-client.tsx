"use client";
import { useCallback, useMemo, useState } from "react";
import { useGeolocation } from "react-use";

import { Card, CardContent } from "@/components/ui/card";
import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";

import { Location, locations } from "@/mocks/location-mock";
import { universityLocations } from "@/mocks/univerity-mock";
import { LocationListSearch } from "@/components/segments/locations/components/location-list-search";
import { toast } from "sonner";
import { LocationsMap } from "@/components/segments/locations/components/location-map";
import {
  locationFetchRoute,
  RouteCoordinates,
} from "@/lib/location-fetch-route";
import { useInView } from "react-intersection-observer";

const LocationsClient = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const locationList = useMemo<Location[]>(
    () => [...locations, ...universityLocations],
    []
  );

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
    [myLocation.latitude, myLocation.longitude]
  );

  const handleLocate = useCallback(
    (coords: { latitude: number; longitude: number }) => {
      setSelectedCoordinates({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    },
    []
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

        <Card className="h-dvh p-0 overflow-hidden" ref={ref}>
          {/* <MapComponent center={initialCenter} zoom={11} showToggleTheme>
            <MapFlyTo
              coordinates={selectedCoordinates}
              disabled={routeCoordinates.length > 0}
            />

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
          </MapComponent> */}

          {inView && (
            <LocationsMap
              locations={locationList}
              selectedCoordinates={selectedCoordinates}
              routeCoordinates={routeCoordinates}
              myLocation={myLocation}
              isLoadingRoute={isLoadingRoute}
              onRoute={handleRouteToLocation}
              onLocate={handleLocate}
            />
          )}
        </Card>
      </div>
    </SidebarInsetContent>
  );
};

export default LocationsClient;
