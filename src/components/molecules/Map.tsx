import { decodePath } from "@/lib/utils";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllRegion,
  getAllRoads,
  getRoadCondition,
  getRoadMaterial,
  getRoadType,
} from "@/lib/api";
import { Loader2, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import L, { Map as LeafletMap } from "leaflet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

function GeomanControl() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
  }, [map]);
  return null;
}

export default function MapPage() {
  const [roads, setRoads] = useState<Road[]>([]);
  const [selectedRoadId, setSelectedRoadId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const mapRef = useRef<LeafletMap | null>(null);
  const [roadMaterial, setRoadMaterial] = useState<RoadMaterial[]>([]);
  const [roadType, setRoadType] = useState<RoadTypeItem[]>([]);
  const [roadCondition, setRoadCondition] = useState<RoadConditionItem[]>([]);
  const [allRegion, setAllRegion] = useState<RegionResponse>();
  const [error, setError] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Road[] | null>(null);

  const handleApi = async (apiFunc: any, onSuccess: Function) => {
    try {
      const res = await apiFunc(token || "");
      if (res.code === 200) return onSuccess(res);
      if (res.code >= 400 && res.code < 500) {
        setError("Login session expired.");
        setTimeout(() => navigate("/"), 2000);
      } else setError("Internal server error.");
    } catch (e) {
      console.error("API Error:", e);
      setError("An error occurred while loading the data.");
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        handleApi(getAllRoads, (res: AllRoadsResponse) =>
          setRoads(res.ruasjalan || [])
        ),
        handleApi(getRoadMaterial, (res: RoadMaterialResponse) =>
          setRoadMaterial(res.eksisting || [])
        ),
        handleApi(getRoadType, (res: RoadType) =>
          setRoadType(res.eksisting || [])
        ),
        handleApi(getRoadCondition, (res: RoadCondition) =>
          setRoadCondition(res.eksisting || [])
        ),
        handleApi(getAllRegion, setAllRegion),
      ]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    setSelectedRoadId(null);
  }, [
    selectedMaterial,
    selectedCondition,
    selectedType,
    searchQuery,
    searchResult,
  ]);

  const findName = (list: any[], id: number, key: string) =>
    list.find((item) => item.id === id)?.[key] || "-";

  const getMaterialName = (id: number) =>
    findName(roadMaterial, id, "eksisting");
  const getConditionName = (id: number) =>
    findName(roadCondition, id, "kondisi");
  const getTypeName = (id: number) => findName(roadType, id, "jenisjalan");
  const getVillageName = (id: number) =>
    allRegion?.desa.find((d) => d.id === id)?.desa || "-";
  const filteredRoads = roads.filter((road) => {
    const matchMaterial =
      selectedMaterial !== "all"
        ? road.eksisting_id === parseInt(selectedMaterial)
        : true;

    const matchCondition =
      selectedCondition !== "all"
        ? road.kondisi_id === parseInt(selectedCondition)
        : true;

    const matchType =
      selectedType !== "all"
        ? road.jenisjalan_id === parseInt(selectedType)
        : true;

    return matchMaterial && matchCondition && matchType;
  });
  const displayedRoads = searchResult ?? filteredRoads;

  const handleRowClick = (road: Road) => {
    const map = mapRef.current;
    if (!map) return;

    const decodedPath = decodePath(road.paths);
    if (decodedPath.length === 0) return;

    if (road.id === selectedRoadId) setSelectedRoadId(0);
    else setSelectedRoadId(road.id);

    const bounds = L.latLngBounds(decodedPath);
    map.fitBounds(bounds);
  };

  const handleSearchClick = () => {
    const lowerQuery = searchQuery.toLowerCase();

    const result = filteredRoads.filter((road) => {
      const kodeMatch = road.kode_ruas.toLowerCase().includes(lowerQuery);
      const namaMatch = road.nama_ruas.toLowerCase().includes(lowerQuery);
      const desaName = getVillageName(road.desa_id).toLowerCase();
      const desaMatch = desaName.includes(lowerQuery);

      return kodeMatch || namaMatch || desaMatch;
    });

    setSearchResult(result);
  };

  const getRoadColor = (road: Road) => {
    switch (road.jenisjalan_id) {
      case 3:
        return "blue";
      case 2:
        return "red";
      default:
        return "green";
    }
  };

  if (error)
    return <div className="text-red-500 flex m-5 justify-center">{error}</div>;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Table Side */}
      <div className="w-[40%] overflow-y-auto border-r p-4 bg-white">
        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <Loader2 className="animate-spin mr-2" /> Loading roads data...
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4 items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code, name, or village"
                className="border px-3 py-2 rounded-md w-full"
              />
              <Button
                onClick={handleSearchClick}
                variant="outline"
                className="p-5"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResult(null);
                }}
                variant="outline"
                className="p-5"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex gap-2 mb-4">
              <Select
                onValueChange={setSelectedMaterial}
                value={selectedMaterial === "all" ? "" : selectedMaterial}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {roadMaterial.map((m) => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      {m.eksisting}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={setSelectedCondition}
                value={selectedCondition === "all" ? "" : selectedCondition}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {roadCondition.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.kondisi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={setSelectedType}
                value={selectedType === "all" ? "" : selectedType}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {roadType.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.jenisjalan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedMaterial("all");
                  setSelectedCondition("all");
                  setSelectedType("all");
                }}
                className="p-2 rounded-md"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedRoads.map((road) => (
                  <TableRow
                    key={road.id}
                    onClick={() => handleRowClick(road)}
                    className={`cursor-pointer ${
                      selectedRoadId === road.id ? "bg-gray-200" : ""
                    }`}
                  >
                    <TableCell>{road.kode_ruas}</TableCell>
                    <TableCell>{road.nama_ruas}</TableCell>
                    <TableCell>{getVillageName(road.desa_id)}</TableCell>
                    <TableCell>{getMaterialName(road.eksisting_id)}</TableCell>
                    <TableCell>{getConditionName(road.kondisi_id)}</TableCell>
                    <TableCell>{getTypeName(road.jenisjalan_id)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>

      {/* Map Side */}
      <div className="w-[60%] relative">
        <MapContainer
          center={[-8.782802, 115.17815]}
          zoom={11}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
          ref={(node) => {
            if (node) mapRef.current = node;
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeomanControl />
          {displayedRoads.map((road) => {
            const decodedPath = decodePath(road.paths);
            if (decodedPath.length === 0) return null;

            const isSelected = road.id === selectedRoadId;
            const roadColor = isSelected ? "yellow" : getRoadColor(road);

            return (
              <Polyline
                key={`${road.id}-${road.id === selectedRoadId}`}
                positions={decodedPath}
                color={roadColor}
                weight={isSelected ? 6 : 4}
                opacity={isSelected ? 1 : 0.8}
              >
                <Tooltip direction="top" sticky>
                  <div>
                    <strong>{road.nama_ruas}</strong>
                    <br />
                    Length: {road.panjang / 1000 || "-"} km
                    <br />
                    Width: {road.lebar || "-"} m
                  </div>
                </Tooltip>
              </Polyline>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded shadow z-[1000] text-sm">
          <div className="flex items-center mb-1">
            <span className="w-4 h-4 bg-blue-600 mr-2 inline-block"></span>
            Jalan Provinsi
          </div>
          <div className="flex items-center mb-1">
            <span className="w-4 h-4 bg-red-500 mr-2 inline-block"></span>
            Jalan Kabupaten
          </div>
          <div className="flex items-center mb-1">
            <span className="w-4 h-4 bg-green-600 mr-2 inline-block"></span>
            Jalan Desa
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-yellow-300 mr-2 inline-block"></span>
            Jalan Dipilih
          </div>
        </div>
      </div>
    </div>
  );
}
