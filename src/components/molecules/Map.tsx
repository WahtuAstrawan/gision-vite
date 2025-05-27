import {
  MapContainer,
  TileLayer,
  useMap,
  Polyline,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useEffect } from "react";
import { type Road } from "@/lib/types";
import { decodePath } from "@/lib/utils";

function GeomanControl() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.pm.addControls({
      position: "topright",
    });
  }, [map]);

  return null;
}

type MapProps = {
  roads: Road[];
};

export default function Map({ roads }: MapProps) {
  return (
    <MapContainer
      center={[-8.782802, 115.17815]}
      zoom={11}
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeomanControl />

      {roads.map((road) => {
        const decodedPath = decodePath(road.paths);
        if (decodedPath.length === 0) return null;

        return (
          <Polyline key={road.id} positions={decodedPath} color="blue">
            <Tooltip>{road.nama_ruas}</Tooltip>
          </Polyline>
        );
      })}
    </MapContainer>
  );
}
