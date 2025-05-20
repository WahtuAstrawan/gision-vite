import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  return (
    <MapContainer
      center={[-8.782802, 115.17815]}
      zoom={13}
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      {/* <MapView center={center} /> */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
