import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import polyline from "@mapbox/polyline";
import {
  MapContainer,
  TileLayer,
  Polyline as LeafletPolyline,
} from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

interface ViewMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paths: string;
  roadName: string;
}

const ViewMapDialog: React.FC<ViewMapDialogProps> = ({
  open,
  onOpenChange,
  paths,
  roadName,
}) => {
  let decodedPath: [number, number][] = [];
  try {
    decodedPath = polyline.decode(paths) as [number, number][];
  } catch (e) {
    console.error("Failed to decode polyline:", e);
  }

  const center: LatLngTuple =
    decodedPath.length > 0 ? [decodedPath[0][0], decodedPath[0][1]] : [0, 0];

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
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {decodedPath.length > 0 && (
              <LeafletPolyline positions={decodedPath} color="blue" />
            )}
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMapDialog;
