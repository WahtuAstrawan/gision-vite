import { decodePath } from '@/lib/utils';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import {
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';

function GeomanControl() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
  }, [map]);

  return null;
}

type MapProps = {
  roads: Road[];
};

export default function Map({ roads }: MapProps) {
  return (
    <>
      <MapContainer
        center={[-8.782802, 115.17815]}
        zoom={11}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeomanControl />

        {roads.map((road) => {
          const decodedPath = decodePath(road.paths);
          if (decodedPath.length === 0) return null;

          return (
            <Polyline
              key={road.id}
              positions={decodedPath}
              color={
                road.jenisjalan_id === 3
                  ? 'blue'
                  : road.jenisjalan_id === 2
                  ? 'red'
                  : 'green'
              }
            >
              <Tooltip>{road.nama_ruas}</Tooltip>
            </Polyline>
          );
        })}
      </MapContainer>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 0 6px rgba(0,0,0,0.3)',
          zIndex: 1000,
          fontSize: '14px',
        }}
      >
        <div>
          <span
            style={{ background: 'blue', padding: '4px 8px', marginRight: 8 }}
          ></span>
          Jalan Provinsi
        </div>
        <div>
          <span
            style={{ background: 'red', padding: '4px 8px', marginRight: 8 }}
          ></span>
          Jalan Kabupaten
        </div>
        <div>
          <span
            style={{ background: 'green', padding: '4px 8px', marginRight: 8 }}
          ></span>
          Jalan Desa
        </div>
      </div>
    </>
  );
}
