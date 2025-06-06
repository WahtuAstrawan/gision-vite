import * as polyline from '@mapbox/polyline';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function decodePath(pathString: string): [number, number][] {
  try {
    return polyline.decode(pathString) as [number, number][];
  } catch (e) {
    console.error('Failed to decode polyline path:', e);
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

export const handleApi = async <T>(
  apiFunc: (token: string) => Promise<T>,
  token: string,
  onSuccess: (res: T) => void,
  options?: {
    onError?: (message: string) => void;
    onExpired?: () => void;
  }
) => {
  try {
    const res: any = await apiFunc(token);

    if (res.code === 200) {
      return onSuccess(res);
    }

    if (res.code >= 400 && res.code < 500) {
      options?.onError?.('Login session expired.');
      options?.onExpired?.();
    } else {
      options?.onError?.('Internal server error.');
    }
  } catch (e) {
    console.error('API Error:', e);
    options?.onError?.('An error occurred while loading the data.');
  }
};
