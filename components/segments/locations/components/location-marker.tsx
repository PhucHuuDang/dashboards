"use client";
import dynamic from "next/dynamic";

import { MapPinIcon } from "lucide-react";
import { useInView } from "react-intersection-observer";

import type { Location } from "@/mocks/location-mock";

import { BlurFade } from "@/components/common/blur-fade";
import { LocationCard } from "@/components/segments/locations/components/location-card";

const MapMarker = dynamic(
  () => import("@/components/ui/map").then((m) => m.MapMarker),
  { ssr: false },
);
const MarkerContent = dynamic(
  () => import("@/components/ui/map").then((m) => m.MarkerContent),
  { ssr: false },
);
const MarkerPopup = dynamic(
  () => import("@/components/ui/map").then((m) => m.MarkerPopup),
  { ssr: false },
);

type Props = {
  locations: Location[];
  selectedCoordinates: Location["coordinates"] | null;
  isLoadingRoute: boolean;
  onRoute: (coords: Location["coordinates"]) => void;
};

export function LocationMarkers({
  locations,
  selectedCoordinates,
  isLoadingRoute,
  onRoute,
}: Props) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {inView &&
        locations.map((location: Location, index: number) => {
          const isSelected =
            selectedCoordinates?.lat === location.coordinates.lat &&
            selectedCoordinates?.lng === location.coordinates.lng;

          return (
            <BlurFade key={location.id} delay={index * 0.03}>
              <MapMarker
                longitude={location.coordinates.lng}
                latitude={location.coordinates.lat}
              >
                <MarkerContent>
                  <MapPinIcon
                    className={`${
                      isSelected ? "text-primary scale-125" : "text-white"
                    } transition-all`}
                  />
                </MarkerContent>

                <MarkerPopup className="bg-transparent border-none p-0">
                  <LocationCard
                    icon={MapPinIcon}
                    location={location}
                    className="w-96"
                    isSelected={isSelected}
                    handleGetCoordinates={() => {}}
                    handleRouteToLocation={() => onRoute(location.coordinates)}
                    isLoadingRoute={isLoadingRoute && isSelected}
                  />
                </MarkerPopup>
              </MapMarker>
            </BlurFade>
          );
        })}
    </div>
  );
}
