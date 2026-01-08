export type RouteCoordinates = [number, number][];

export async function locationFetchRoute(
  start: [number, number],
  end: [number, number]
): Promise<RouteCoordinates> {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Route API error:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log("Route API response:", data);

    if (data.code === "Ok" && data.routes && data.routes.length > 0) {
      const coordinates = data.routes[0].geometry
        .coordinates as RouteCoordinates;
      return coordinates;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch route:", error);
    return [];
  }
}
