"use client";
import { Card, CardContent } from "@/components/ui/card";
import { LocationListSearch } from "@/components/segments/locations/components/location-list-search";
import { Location } from "@/mocks/location-mock";

type Props = {
  locationList: Location[];
  selectedCoordinates: Location["coordinates"] | null;
  isLoadingRoute: boolean;
  onSelect: (coords: Location["coordinates"]) => void;
  onRoute: (coords: Location["coordinates"]) => void;
};

export function LocationsSidebar({
  locationList,
  selectedCoordinates,
  isLoadingRoute,
  onSelect,
  onRoute,
}: Props) {
  return (
    <Card className="min-w-1/3 absolute h-full top-0 left-0 my-2 z-10 p-0">
      <CardContent className="p-0">
        <LocationListSearch
          locationList={locationList}
          handleGetCoordinates={onSelect}
          handleRouteToLocation={onRoute}
          isLoadingRoute={isLoadingRoute}
          selectedCoordinates={selectedCoordinates}
        />
      </CardContent>
    </Card>
  );
}
