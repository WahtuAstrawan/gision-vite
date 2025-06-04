import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  deleteRoadById,
  getAllRegion,
  getAllRoads,
  getRoadCondition,
  getRoadMaterial,
  getRoadType,
} from '@/lib/api';
import { decodePath } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, Pencil, Search, Trash, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ConfirmDialog from '../atoms/ConfirmDialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import RoadFormDialog from './RoadFormDialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// TODO: No Pagination Yet

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
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Road[] | null>(null);
  const [selectedRoadForEdit, setSelectedRoadForEdit] = useState<Road | null>(
    null
  );
  const [roadToDelete, setRoadToDelete] = useState<Road | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const handleDelete = async () => {
    if (!roadToDelete) return;

    try {
      const res = await deleteRoadById(roadToDelete.id, token || '');
      if (res.code === 200) {
        toast.success('Road deleted successfully!');
        fetchAllRoads();
      } else {
        toast.error('Failed to delete road.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during deletion.');
    } finally {
      setRoadToDelete(null);
    }
  };

  const fetchAllRoads = async () => {
    try {
      const res = await getAllRoads(token || '');
      if (res.code === 200) {
        setRoads(res.ruasjalan || []);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to load road data.');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllRoads(token || '').then((res) => setRoads(res.ruasjalan || [])),
      getRoadMaterial(token || '').then((res) =>
        setRoadMaterial(res.eksisting || [])
      ),
      getRoadType(token || '').then((res) => setRoadType(res.eksisting || [])),
      getRoadCondition(token || '').then((res) =>
        setRoadCondition(res.eksisting || [])
      ),
      getAllRegion(token || '').then(setAllRegion),
    ])
      .catch((e) => {
        console.error(e);
        setError('Failed to load data.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApi = async (apiFunc: any, onSuccess: Function) => {
    try {
      const res = await apiFunc(token || '');
      if (res.code === 200) return onSuccess(res);
      if (res.code >= 400 && res.code < 500) {
        setError('Login session expired.');
        setTimeout(() => navigate('/'), 2000);
      } else setError('Internal server error.');
    } catch (e) {
      console.error('API Error:', e);
      setError('An error occurred while loading the data.');
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
    list.find((item) => item.id === id)?.[key] || '-';

  const getMaterialName = (id: number) =>
    findName(roadMaterial, id, 'eksisting');
  const getConditionName = (id: number) =>
    findName(roadCondition, id, 'kondisi');
  const getTypeName = (id: number) => findName(roadType, id, 'jenisjalan');
  const getVillageName = (id: number) =>
    allRegion?.desa.find((d) => d.id === id)?.desa || '-';
  const filteredRoads = roads.filter((road) => {
    const matchMaterial =
      selectedMaterial !== 'all'
        ? road.eksisting_id === parseInt(selectedMaterial)
        : true;

    const matchCondition =
      selectedCondition !== 'all'
        ? road.kondisi_id === parseInt(selectedCondition)
        : true;

    const matchType =
      selectedType !== 'all'
        ? road.jenisjalan_id === parseInt(selectedType)
        : true;

    return matchMaterial && matchCondition && matchType;
  });

  const handleRowClick = (road: Road) => {
    const map = mapRef.current;
    if (!map) return;

    const decodedPath = decodePath(road.paths);
    if (decodedPath.length === 0) return;

    if (road.id === selectedRoadId) setSelectedRoadId(0);
    else setSelectedRoadId(road.id);

    const bounds = L.latLngBounds(decodedPath);
    map.flyToBounds(bounds);
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
        return 'blue';
      case 2:
        return 'red';
      default:
        return 'green';
    }
  };

  const getDashArray = (kondisiId: number): string | undefined => {
    switch (kondisiId) {
      case 1:
        return '';
      case 2:
        return '6 4';
      case 3:
        return '2 6';
      default:
        return undefined;
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRoads, searchResult]);

  const dataToPaginate = searchResult ?? filteredRoads;
  const paginatedRoads = dataToPaginate.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(dataToPaginate.length / itemsPerPage);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Table Side */}
      <div className="w-[50%] overflow-y-auto border-r p-4 bg-white">
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
                  setSearchQuery('');
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
                value={selectedMaterial === 'all' ? '' : selectedMaterial}
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
                value={selectedCondition === 'all' ? '' : selectedCondition}
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
                value={selectedType === 'all' ? '' : selectedType}
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
                  setSelectedMaterial('all');
                  setSelectedCondition('all');
                  setSelectedType('all');
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
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRoads.map((road) => (
                  <TableRow
                    key={road.id}
                    onClick={() => handleRowClick(road)}
                    className={`cursor-pointer ${
                      selectedRoadId === road.id ? 'bg-gray-200' : ''
                    }`}
                  >
                    <TableCell>{road.kode_ruas}</TableCell>
                    <TableCell>{road.nama_ruas}</TableCell>
                    <TableCell>{getVillageName(road.desa_id)}</TableCell>
                    <TableCell>{getMaterialName(road.eksisting_id)}</TableCell>
                    <TableCell>{getConditionName(road.kondisi_id)}</TableCell>
                    <TableCell>{getTypeName(road.jenisjalan_id)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-1">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedRoadForEdit(road);
                            setOpenDialog(true);
                          }}
                          className="bg-amber-500 hover:bg-amber-400"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="hover:bg-red-400"
                          onClick={() => setRoadToDelete(road)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination className="mt-4 justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className={
                          currentPage === page
                            ? 'bg-primary text-primary-foreground cursor-pointer'
                            : 'hover:bg-muted cursor-pointer'
                        }
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage((prev) => prev + 1);
                      }
                    }}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            {allRegion && (
              <RoadFormDialog
                open={openDialog}
                onOpenChange={(open) => {
                  setOpenDialog(open);
                  if (!open) setSelectedRoadForEdit(null);
                }}
                onSuccess={() => {
                  toast.success(
                    selectedRoadForEdit
                      ? 'Road updated successfully!'
                      : 'Road added successfully!'
                  );
                  fetchAllRoads();
                }}
                allRegion={allRegion}
                roadMaterial={roadMaterial}
                roadType={roadType}
                roadCondition={roadCondition}
                initialData={selectedRoadForEdit ?? undefined}
              />
            )}

            <ConfirmDialog
              open={!!roadToDelete}
              onOpenChange={(open) => {
                if (!open) setRoadToDelete(null);
              }}
              title="Delete Road"
              description={`Are you sure you want to delete the road "${roadToDelete?.nama_ruas}"? This action cannot be undone.`}
              onConfirm={handleDelete}
            />
          </>
        )}
      </div>

      {/* Map Side */}
      <div className="w-[50%] relative">
        <MapContainer
          center={[-8.782802, 115.17815]}
          zoom={11}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
          ref={(node) => {
            if (node) mapRef.current = node;
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeomanControl />
          {paginatedRoads.map((road) => {
            const decodedPath = decodePath(road.paths);
            if (decodedPath.length === 0) return null;

            const isSelected = road.id === selectedRoadId;
            const roadColor = isSelected ? 'yellow' : getRoadColor(road);

            return (
              <Polyline
                key={`${road.id}-${road.id === selectedRoadId}`}
                positions={decodedPath}
                color={roadColor}
                dashArray={getDashArray(road.kondisi_id)}
                weight={road.jenisjalan_id * 3}
                opacity={isSelected ? 1 : 0.8}
              >
                <Tooltip direction="top" sticky>
                  <div>
                    <strong>{road.nama_ruas}</strong>
                    <br />
                    Length: {road.panjang / 1000 || '-'} km
                    <br />
                    Width: {road.lebar || '-'} m
                    <br />
                    Desc: {road.keterangan || '-'}
                  </div>
                </Tooltip>
              </Polyline>
            );
          })}
        </MapContainer>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
