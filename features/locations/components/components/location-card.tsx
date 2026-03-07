import { useRef, useState } from "react";

import {
  HeartIcon,
  Loader2,
  LucideIcon,
  Pin,
  Route,
  UsersIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocationContext } from "@/features/locations/contexts/location-context";
import { categories } from "@/features/locations/mocks/category-location-mock";

import type { Location } from "@/features/locations/mocks/location-mock";
import type { IconComponent } from "@/types";

interface LocationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  location: Location;
  isSelected: boolean;
}

export const LocationCard = ({
  location,
  className,
  isSelected,
  ...props
}: LocationCardProps) => {
  const { state, actions } = useLocationContext();
  const { isLoadingRoute: globalIsLoadingRoute, selectedCoordinates } = state;
  const { handleGetCoordinates, handleRouteToLocation } = actions;

  const isLoadingRoute =
    globalIsLoadingRoute &&
    selectedCoordinates?.lat === location.coordinates.lat &&
    selectedCoordinates?.lng === location.coordinates.lng;

  const refCard = useRef<HTMLDivElement>(null);

  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setMouse({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    if (refCard.current) {
      refCard.current.style.backgroundColor = "";
      setMouse(null);
    }
  };

  const category = categories.find(
    (category) => category.id === location.categoryId,
  );

  // const categoryColor = category?.color;
  // console.log(categoryColor);

  const CategoryIcon: IconComponent = category?.icon as IconComponent;

  return (
    <Card
      {...props}
      className={cn(
        `w-full group  cursor-pointer relative border ${
          isSelected ? "border-primary" : "hover:border-primary/70"
        } transition-all duration-300 bg-blur-md`,
        className,
      )}
      ref={refCard}
      onMouseMove={handleMouseEnter}
      // onMouseOver={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {mouse && (
        <div
          className="
           pointer-events-none
           absolute
           -translate-x-1/2 -translate-y-1/2
           rounded-full
           bg-primary/5
           transition-transform duration-200 ease-out
         "
          style={{
            width: 250,
            height: 250,
            transform: `translate(${mouse.x}px, ${mouse.y}px)`,
          }}
        />
      )}

      <CardHeader className="">
        <div className="flex items-center justify-between gap-2 ">
          <div className="flex  gap-2">
            {CategoryIcon && (
              <CategoryIcon
                className={cn(
                  `size-5 md:size-8 text-foreground ${
                    isSelected ? "text-primary" : "group-hover:text-primary"
                  } transition-colors duration-300`,
                )}
              />
            )}

            <div className="flex flex-col gap-1">
              <CardTitle
                className={cn(
                  "flex items-center justify-between gap-2 transition-all duration-300 ",
                  `${isSelected ? "text-primary" : "group-hover:text-primary"}`,
                )}
              >
                {location.name}
              </CardTitle>

              <CardDescription
                className={`${
                  isSelected ? "text-accent-foreground/90" : ""
                } group-hover:text-accent-foreground/90`}
              >
                {location.description}
              </CardDescription>
            </div>
          </div>

          <span>{location.rating}*</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4" />
              <span className="text-xs md:text-sm">
                {location.visitCount} visits
              </span>
            </div>

            <div className="flex items-center gap-2">
              <HeartIcon className="size-4 text-primary hover:scale-105 transition-all duration-300 cursor-pointer" />

              <Pin className="size-4 text-primary hover:scale-105 transition-all duration-300 cursor-pointer" />
            </div>
          </div>

          {location.tags.map((tag, index) => {
            return (
              <Badge
                key={index}
                variant="outline"
                className="text-xs font-medium border border-primary/30 mx-0.5"
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex-wrap gap-1 justify-end">
        <Button variant="outline" size="sm" onClick={() => {}}>
          Favorite
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRouteToLocation(location.coordinates)}
          disabled={isLoadingRoute}
          className="gap-1.5"
        >
          {isLoadingRoute ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Route className="size-3.5" />
              Route
            </>
          )}
        </Button>
        <Button
          variant="default"
          size="sm"
          className="cursor-pointer"
          onClick={() => handleGetCoordinates(location.coordinates)}
        >
          Get Directions
        </Button>
      </CardFooter>
    </Card>
  );
};
