"use client";
import { Card, CardContent } from "@/components/ui/card";
import { LocationListSearch } from "@/features/locations/components/components/location-list-search";

export function LocationsSidebar() {
  return (
    <Card className="min-w-1/3 absolute h-full top-0 left-0 my-2 z-10 p-0 border-none bg-transparent outline-none ring-0">
      <CardContent className="p-0 bg-transparent border-none">
        <LocationListSearch />
      </CardContent>
    </Card>
  );
}
