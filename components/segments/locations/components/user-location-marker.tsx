"use client";
import dynamic from "next/dynamic";
import { Navigation } from "lucide-react";

const MapMarker = dynamic(
  () => import("@/components/ui/map").then((m) => m.MapMarker),
  { ssr: false }
);
const MarkerContent = dynamic(
  () => import("@/components/ui/map").then((m) => m.MarkerContent),
  { ssr: false }
);

export function UserLocationMarker({
  latitude,
  longitude,
}: {
  latitude?: number;
  longitude?: number;
}) {
  if (!latitude || !longitude) return null;

  return (
    <MapMarker longitude={longitude} latitude={latitude}>
      <MarkerContent>
        <div className="relative">
          <div className="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping" />
          <Navigation className="size-6 text-blue-500 fill-blue-500" />
        </div>
      </MarkerContent>
    </MapMarker>
  );
}
