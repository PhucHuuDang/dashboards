import {
  HeartIcon,
  Loader2,
  LucideIcon,
  Pin,
  Route,
  UsersIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Prettify } from "@/types";
import { Location } from "@/mocks/location-mock";
import { Button } from "../../../ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface LocationCardProps
  extends Prettify<React.ComponentProps<typeof Card>> {
  icon: LucideIcon;

  location: Location;
  handleGetCoordinates: (coordinates: Location["coordinates"]) => void;
  handleRouteToLocation: () => void;
  isLoadingRoute?: boolean;
}

export const LocationCard = ({
  icon: Icon,
  location,
  className,
  handleGetCoordinates,
  handleRouteToLocation,
  isLoadingRoute = false,
  ...props
}: LocationCardProps) => {
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

  return (
    <Card
      {...props}
      className={cn(
        "w-full group/card  cursor-pointer relative border hover:border-primary/30 transition-all duration-300",
        className
      )}
      ref={refCard}
      onMouseMove={handleMouseEnter}
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
            <Icon className="size-5 md:size-8 text-primary" />

            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center justify-between gap-2">
                {location.name}

                {/* <span>{location.rating}*</span> */}
              </CardTitle>

              <CardDescription>{location.description}</CardDescription>
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
          onClick={handleRouteToLocation}
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
