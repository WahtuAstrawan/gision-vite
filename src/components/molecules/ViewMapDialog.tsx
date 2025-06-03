import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import polyline from '@mapbox/polyline';
import type { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as React from 'react';
import {
  Polyline as LeafletPolyline,
  MapContainer,
  TileLayer,
} from 'react-leaflet';

interface ViewMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paths: string;
  roadName: string;
  roadType: number;
}

const ViewMapDialog: React.FC<ViewMapDialogProps> = ({
  open,
  onOpenChange,
  paths,
  roadName,
  roadType,
}) => {
  let decodedPath: [number, number][] = [];
  try {
    decodedPath = polyline.decode(paths) as [number, number][];
  } catch (e) {
    console.error('Failed to decode polyline:', e);
  }

  const center: LatLngTuple =
    decodedPath.length > 0 ? [decodedPath[0][0], decodedPath[0][1]] : [0, 0];
  let color = 'blue';
  if (roadType === 1) {
    color = 'green';
  } else if (roadType === 2) {
    color = 'red';
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Road View - {roadName}</DialogTitle>
        </DialogHeader>
        <div className="h-[400px] w-full">
          <MapContainer
            center={center}
            zoom={15}
            scrollWheelZoom
            className="h-full w-full rounded-xl"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {decodedPath.length > 0 && (
              <LeafletPolyline positions={decodedPath} color={color} />
            )}
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMapDialog;
