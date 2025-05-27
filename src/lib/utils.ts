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
