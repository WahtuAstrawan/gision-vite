import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import * as polyline from "@mapbox/polyline";
import "@geoman-io/leaflet-geoman-free";

interface MapDrawProps {
  setPath: (encodedPath: string) => void;
}

export const MapDraw: React.FC<MapDrawProps> = ({ setPath }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    map.pm.addControls({
      position: "topleft",
      drawMarker: false,
      drawCircle: false,
      drawRectangle: false,
      drawPolygon: false,
      drawCircleMarker: false,
      drawText: false,
      drawPolyline: true,
      editMode: true,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
    });

    map.on("pm:create", (e: any) => {
      drawnItems.clearLayers();
      drawnItems.addLayer(e.layer);

      const latlngs = e.layer.getLatLngs();
      const encoded = polyline.encode(
        latlngs.map((latlng: any) => [latlng.lat, latlng.lng])
      );
      setPath(encoded);
    });

    map.on("pm:remove", () => {
      setPath("");
    });

    return () => {
      map.removeLayer(drawnItems);
    };
  }, [map, setPath]);

  return null;
};
