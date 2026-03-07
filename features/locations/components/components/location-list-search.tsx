"use client";

import {
  memo,
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import dynamic from "next/dynamic";

import {
  EllipsisVerticalIcon,
  Loader2Icon,
  MapPinIcon,
  SearchX,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { SidebarTrigger } from "@/components/animate-ui/components/radix/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/animate-ui/primitives/radix/dropdown-menu";
import { BlurFade } from "@/components/common/blur-fade";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import GlobeIcon from "@/components/ui/globe-icon";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import MagnifierIcon from "@/components/ui/magnifier-icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLocationContext } from "@/features/locations/contexts/location-context";
import { categories } from "@/features/locations/mocks/category-location-mock";
import { IconComponent } from "@/types";

import type {
  Location,
  LocationCategory,
} from "@/features/locations/mocks/location-mock";

const LocationCard = dynamic(
  () =>
    import("@/features/locations/components/components/location-card").then(
      (m) => m.LocationCard,
    ),
  { ssr: false },
);

type CategoryId = LocationCategory["id"];

function filterLocations(
  locations: Location[],
  query: string,
  categoryId: string | null,
): Location[] {
  return locations.filter((location) => {
    if (categoryId && location.categoryId !== categoryId) return false;

    if (!query.trim()) {
      return true;
    }

    const searchableText = [
      location.name,
      categories.find((category) => category.id === location.categoryId)?.name,
      // location.description,
      location.address,
      ...location.tags,
    ]
      .join(" ")
      .toLowerCase();

    return query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .every((term) => searchableText.includes(term));
  });
}

export const LocationListSearch = memo(() => {
  const { state, actions } = useLocationContext();
  const { locationList, selectedCoordinates } = state;
  const { handleGetCoordinates } = actions;
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const deferredQuery = useDeferredValue(searchQuery);

  const filteredLocations = useMemo(() => {
    const categoryId = selectedCategory || hoveredCategory;

    return filterLocations(locationList, deferredQuery, categoryId);
  }, [locationList, deferredQuery, selectedCategory, hoveredCategory]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      startTransition(() => {
        setSearchQuery(value);
      });
    },
    [],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(null);
    setHoveredCategory(null);
    inputRef.current?.focus();
  }, []);

  const isSearching = isPending || searchQuery !== deferredQuery;
  const hasNoResults =
    filteredLocations.length === 0 && deferredQuery.trim() !== "";

  const delays = useMemo(() => {
    return Object.fromEntries(
      filteredLocations.map((l, i) => [l.id, i * 0.03]),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredLocations.map((l) => l.id).join()]);

  const countCategories = useMemo(() => {
    const results = locationList.reduce<Record<CategoryId, number>>(
      (acc: Record<string, number>, location) => {
        if (location.categoryId in acc) {
          acc[location.categoryId]++;
        }
        return acc;
      },
      {
        restaurants: 0,
        cafes: 0,
        bars: 0,
        parks: 0,
        museums: 0,
        shops: 0,
        hotels: 0,
        gyms: 0,
        university: 0,
      },
    );
    return results;
  }, [locationList]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 sticky top-0 z-10 bg-transparent border rounded-lg ml-2 ">
        <CardHeader className="flex items-center justify-between my-4 ">
          <div className="flex items-center gap-2 w-full">
            <GlobeIcon className="size-6 text-primary" />
            <CardTitle className="text-sm font-medium text-primary">
              Locations
            </CardTitle>
          </div>

          <div className="w-fit py-1 px-2 group hover:border-foreground/20 rounded-full flex items-center gap-2  transition-colors duration-300 cursor-pointer border border-border">
            <SidebarTrigger />
            <div className="bg-muted hover:bg-muted/80 transition-colors duration-300 rounded-full p-1 cursor-pointer">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <EllipsisVerticalIcon className="size-6 text-muted-foreground focus:border-none focus:ring-0 hover:scale-105 transition duration-300" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="right"
                  sideOffset={40}
                  align="start"
                  alignOffset={-10}
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-blur-md"
                >
                  <DropdownMenuGroup>
                    {categories.map((category: LocationCategory) => {
                      const Icon: IconComponent = category.icon;

                      const active =
                        hoveredCategory === category.id ||
                        selectedCategory === category.id;
                      return (
                        <DropdownMenuItem
                          key={category.id}
                          className="cursor-pointer group border hover:bg-primary/30! transition duration-300 flex items-center justify-between"
                          onMouseEnter={() => {
                            setHoveredCategory(category.id);
                          }}
                          onMouseLeave={() => {
                            setHoveredCategory(null);
                          }}
                          onSelect={() => {
                            setSelectedCategory(category.id);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {Icon && (
                              <Icon
                                className={cn(
                                  "size-4",
                                  active
                                    ? "text-primary"
                                    : "text-muted-foreground",
                                )}
                              />
                            )}

                            <span
                              className={cn(
                                "text-sm font-medium",
                                active
                                  ? "text-primary"
                                  : "text-muted-foreground",
                              )}
                            >
                              {category.name}
                            </span>
                          </div>

                          <DropdownMenuShortcut className="text-xs bg-muted/50 group-hover:bg-muted/80 group-hover:border-primary rounded-full border p-0.5 transition-all duration-300">
                            <span className="text-xs  text-card-foreground rounded-full p-0.5 w-fit h-fit group-hover:text-primary">
                              {
                                countCategories[
                                  category.id as keyof typeof countCategories
                                ]
                              }
                            </span>
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <Separator className="my-4" />

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

      <ScrollArea className="h-dvh rounded-lg mt-2">
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
          {filteredLocations.map((location: Location) => {
            const isSelected =
              selectedCoordinates?.lat === location.coordinates.lat &&
              selectedCoordinates?.lng === location.coordinates.lng;
            return (
              <BlurFade key={location.id} inView delay={delays[location.id]}>
                <LocationCard
                  icon={MapPinIcon}
                  onClick={() => handleGetCoordinates(location.coordinates)}
                  location={location}
                  isSelected={isSelected}
                />
              </BlurFade>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
});

LocationListSearch.displayName = "LocationListSearch";
