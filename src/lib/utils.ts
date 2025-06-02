import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as polyline from "@mapbox/polyline";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function decodePath(pathString: string): [number, number][] {
  try {
    return polyline.decode(pathString) as [number, number][];
  } catch (e) {
    console.error("Failed to decode polyline path:", e);
    return [];
  }
}

export function haversineDistance(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number]
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371000;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getPolylineLength(path: [number, number][]): number {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    total += haversineDistance(path[i], path[i + 1]);
  }
  return total;
}
