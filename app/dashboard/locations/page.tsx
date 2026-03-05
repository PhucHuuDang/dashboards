import { Metadata } from "next";

import LocationsClient from "@/components/segments/locations/location-map-client";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "The locations of the dashboard show the locations such as universities, schools, hospitals, etc.",
  keywords: ["locations", "universities", "schools", "hospitals", "dashboard"],

  applicationName: "Locations",
  abstract:
    "The locations of the dashboard show the locations such as universities, schools, hospitals, etc.",
};

const LocationPage = () => {
  return <LocationsClient />;
};

export default LocationPage;
