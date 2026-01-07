"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { LocationCard } from "@/components/card-block/location-card";
import { Loader2Icon, MapPinIcon, SearchX } from "lucide-react";
import { Location } from "@/mocks/location-mock";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MagnifierIcon from "@/components/ui/magnifier-icon";
import { InputGroup } from "@/components/ui/input-group";
import {
  memo,
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

interface LocationListSearchProps {
  locationList: Location[];
  handleGetCoordinates: (coordinates: Location["coordinates"]) => void;
  handleRouteToLocation: (coordinates: Location["coordinates"]) => void;
  isLoadingRoute: boolean;
  selectedCoordinates: Location["coordinates"] | null;
}

function searchLocations(locations: Location[], query: string): Location[] {
  if (!query.trim()) return locations;

  const searchTerms = query.toLowerCase().trim().split(/\s+/);

  return locations.filter((location) => {
    const searchableText = [
      location.name,
      // location.description,
      location.address,
      ...location.tags,
    ]
      .join(" ")
      .toLowerCase();

    return searchTerms.every((term) => searchableText.includes(term));
  });
}

export const LocationListSearch = memo(
  ({
    locationList,
    handleGetCoordinates,
    handleRouteToLocation,
    isLoadingRoute,
    selectedCoordinates,
  }: LocationListSearchProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();

    const deferredQuery = useDeferredValue(searchQuery);

    const filteredLocations = useMemo(() => {
      return searchLocations(locationList, deferredQuery);
    }, [locationList, deferredQuery]);

    const handleSearch = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        startTransition(() => {
          setSearchQuery(value);
        });
      },
      []
    );

    const handleClearSearch = useCallback(() => {
      setSearchQuery("");
      inputRef.current?.focus();
    }, []);

    const isSearching = isPending || searchQuery !== deferredQuery;
    const hasNoResults =
      filteredLocations.length === 0 && deferredQuery.trim() !== "";

    return (
      <div className="flex flex-col h-full">
        <div className="p-2 sticky top-0 bg-background z-10">
          <InputGroup>
            <Input
              placeholder="Search by name, address, or tags..."
              value={searchQuery}
              onChange={handleSearch}
              ref={inputRef}
            />

            <Button
              variant="secondary"
              size="icon-sm"
              onClick={
                hasNoResults || searchQuery ? handleClearSearch : undefined
              }
              disabled={isSearching && !searchQuery}
            >
              {isSearching ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <MagnifierIcon className="size-4" />
              )}
            </Button>
          </InputGroup>
        </div>

        <ScrollArea className="h-dvh rounded-lg">
          {/* Search results count */}
          {deferredQuery.trim() && (
            <p className="text-xs text-muted-foreground my-1.5 px-1">
              {filteredLocations.length} result
              {filteredLocations.length !== 1 ? "s" : ""} found
            </p>
          )}
          <div className="p-2 pt-0 space-y-2">
            {/* Empty state */}
            {hasNoResults && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <SearchX className="size-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No locations found
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Try adjusting your search terms
                </p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleClearSearch}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            )}

            {/* Location cards */}
            {filteredLocations.map((location: Location) => (
              <LocationCard
                key={location.id}
                icon={MapPinIcon}
                onClick={() => handleGetCoordinates(location.coordinates)}
                location={location}
                handleGetCoordinates={handleGetCoordinates}
                handleRouteToLocation={() => {
                  handleRouteToLocation(location.coordinates);
                }}
                isLoadingRoute={
                  isLoadingRoute &&
                  selectedCoordinates?.lat === location.coordinates.lat &&
                  selectedCoordinates?.lng === location.coordinates.lng
                }
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }
);

LocationListSearch.displayName = "LocationListSearch";
