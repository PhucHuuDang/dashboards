import { DumbbellIcon, LandmarkIcon, TreesIcon } from "lucide-react";

import BookIcon from "@/components/ui/book-icon";
import ChartBarIcon from "@/components/ui/chart-bar-icon";
import CoffeeIcon from "@/components/ui/coffee-icon";
import HotelIcon from "@/components/ui/hotel-icon";
import ShoppingCartIcon from "@/components/ui/shopping-cart-icon";

import { LocationCategory } from "./location-mock";

export const categories: LocationCategory[] = [
  {
    id: "restaurants",
    name: "Restaurants",
    icon: HotelIcon,
    color: "#ef4444",
  },
  { id: "cafes", name: "Cafés", icon: CoffeeIcon, color: "#f97316" },
  { id: "bars", name: "Bars", icon: ChartBarIcon, color: "#8b5cf6" },
  { id: "parks", name: "Parks", icon: TreesIcon, color: "#22c55e" },
  { id: "museums", name: "Museums", icon: LandmarkIcon, color: "#3b82f6" },
  { id: "shops", name: "Shopping", icon: ShoppingCartIcon, color: "#ec4899" },
  { id: "hotels", name: "Hotels", icon: HotelIcon, color: "#06b6d4" },
  { id: "gyms", name: "Fitness", icon: DumbbellIcon, color: "#eab308" },
  { id: "university", name: "University", icon: BookIcon, color: "#06b6d4" },
];
