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
import { decodePath, getDashArray, getRoadColor, handleApi } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pencil, Trash } from 'lucide-react';
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
import Legend from '../atoms/Legend';
import Loading from '../atoms/Loading';
import { PaginationControls } from '../atoms/PaginationControls';
import { SearchInputWithClear } from '../atoms/SearchInputWithClear';
import { FilterControls } from '../molecules/FilterControls';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import RoadFormDialog from './RoadFormDialog';

function GeomanControl() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
  }, [map]);
  return null;
}

export default function MapPage() {
  const [roads, setRoads] = useState<Road[]>([]);
  const [roadMaterial, setRoadMaterial] = useState<RoadMaterial[]>([]);
  const [roadType, setRoadType] = useState<RoadTypeItem[]>([]);
  const [roadCondition, setRoadCondition] = useState<RoadConditionItem[]>([]);
  const [allRegion, setAllRegion] = useState<RegionResponse>();

  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoads, setFilteredRoads] = useState<Road[]>([]);

  const [selectedRoadId, setSelectedRoadId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoadForEdit, setSelectedRoadForEdit] = useState<Road | null>(
    null
  );
  const [roadToDelete, setRoadToDelete] = useState<Road | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { token } = useAuthStore();
  const navigate = useNavigate();
  const mapRef = useRef<LeafletMap | null>(null);

  const totalPages = Math.ceil(filteredRoads.length / itemsPerPage);
  const paginatedRoads = filteredRoads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const findName = (list: any[], id: number, key: string) =>
    list.find((item) => item.id === id)?.[key] || '-';

  const getMaterialName = (id: number) =>
    findName(roadMaterial, id, 'eksisting');
  const getConditionName = (id: number) =>
    findName(roadCondition, id, 'kondisi');
  const getTypeName = (id: number) => findName(roadType, id, 'jenisjalan');
  const getVillageName = (id: number) =>
    allRegion?.desa.find((d) => d.id === id)?.desa || '-';

  const applyFilters = () => {
    let filtered = roads;

    if (selectedMaterial !== 'all') {
      filtered = filtered.filter(
        (road) => road.eksisting_id === parseInt(selectedMaterial)
      );
    }

    if (selectedCondition !== 'all') {
      filtered = filtered.filter(
        (road) => road.kondisi_id === parseInt(selectedCondition)
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(
        (road) => road.jenisjalan_id === parseInt(selectedType)
      );
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((road) => {
        const kodeMatch = road.kode_ruas.toLowerCase().includes(lowerQuery);
        const namaMatch = road.nama_ruas.toLowerCase().includes(lowerQuery);
        const desaName = getVillageName(road.desa_id).toLowerCase();
        const desaMatch = desaName.includes(lowerQuery);
        return kodeMatch || namaMatch || desaMatch;
      });
    }

    setFilteredRoads(filtered);
    setCurrentPage(1);
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

  const handleDelete = async () => {
    if (!roadToDelete) return;

    try {
      const res = await deleteRoadById(roadToDelete.id, token || '');
      if (res.code === 200) {
        toast.success('Road deleted successfully!');
        await fetchAllRoads();
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

  const handleRowClick = (road: Road) => {
    const map = mapRef.current;
    if (!map) return;

    const decodedPath = decodePath(road.paths);
    if (decodedPath.length === 0) return;

    if (road.id === selectedRoadId) {
      setSelectedRoadId(null);
    } else {
      setSelectedRoadId(road.id);
      const bounds = L.latLngBounds(decodedPath);
      map.flyToBounds(bounds);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleClearFilters = () => {
    setSelectedMaterial('all');
    setSelectedCondition('all');
    setSelectedType('all');
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        handleApi(
          getAllRoads,
          token || '',
          (res) => setRoads(res.ruasjalan || []),
          {
            onError: setError,
            onExpired: () => setTimeout(() => navigate('/'), 2000),
          }
        ),
        handleApi(
          getRoadMaterial,
          token || '',
          (res) => setRoadMaterial(res.eksisting || []),
          {
            onError: setError,
          }
        ),
        handleApi(
          getRoadType,
          token || '',
          (res) => setRoadType(res.eksisting || []),
          {
            onError: setError,
          }
        ),
        handleApi(
          getRoadCondition,
          token || '',
          (res) => setRoadCondition(res.eksisting || []),
          {
            onError: setError,
          }
        ),
        handleApi(getAllRegion, token || '', setAllRegion, {
          onError: setError,
        }),
      ]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [roads, selectedMaterial, selectedCondition, selectedType, searchQuery]);

  useEffect(() => {
    setSelectedRoadId(null);
  }, [filteredRoads]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Table Side */}
      <div className="w-[50%] overflow-y-auto border-r p-4 bg-white">
        {loading ? (
          <Loading loadingText="Loading roads data..." />
        ) : (
          <>
            {/* Search Section */}
            <SearchInputWithClear
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={handleClearSearch}
              placeholder="Search code, name, or village"
            />

            {/* Filter Section */}
            <FilterControls
              materialOptions={roadMaterial.map((m) => ({
                id: m.id,
                label: m.eksisting,
              }))}
              selectedMaterial={selectedMaterial}
              onMaterialChange={setSelectedMaterial}
              conditionOptions={roadCondition.map((c) => ({
                id: c.id,
                label: c.kondisi,
              }))}
              selectedCondition={selectedCondition}
              onConditionChange={setSelectedCondition}
              typeOptions={roadType.map((t) => ({
                id: t.id,
                label: t.jenisjalan,
              }))}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              onClearFilters={handleClearFilters}
            />

            {/* Results Info */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {paginatedRoads.length} of {filteredRoads.length} roads
              {filteredRoads.length !== roads.length &&
                ` (filtered from ${roads.length} total)`}
            </div>

            {/* Table */}
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
                {paginatedRoads.length > 0 ? (
                  paginatedRoads.map((road) => (
                    <TableRow
                      key={road.id}
                      onClick={() => handleRowClick(road)}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedRoadId === road.id ? 'bg-gray-200' : ''
                      }`}
                    >
                      <TableCell>{road.kode_ruas}</TableCell>
                      <TableCell>{road.nama_ruas}</TableCell>
                      <TableCell>{getVillageName(road.desa_id)}</TableCell>
                      <TableCell>
                        {getMaterialName(road.eksisting_id)}
                      </TableCell>
                      <TableCell>{getConditionName(road.kondisi_id)}</TableCell>
                      <TableCell>{getTypeName(road.jenisjalan_id)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-1">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setRoadToDelete(road);
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-4 text-gray-500"
                    >
                      No roads found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            {/* Dialogs */}
            {allRegion && (
              <RoadFormDialog
                open={openDialog}
                onOpenChange={(open) => {
                  setOpenDialog(open);
                  if (!open) setSelectedRoadForEdit(null);
                }}
                onSuccess={async () => {
                  toast.success(
                    selectedRoadForEdit
                      ? 'Road updated successfully!'
                      : 'Road added successfully!'
                  );
                  await fetchAllRoads();
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

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
            const roadColor = isSelected
              ? 'yellow'
              : getRoadColor(road.jenisjalan_id);

            return (
              <Polyline
                key={`${road.id}-${isSelected}`}
                positions={decodedPath}
                color={roadColor}
                dashArray={getDashArray(road.kondisi_id)}
                weight={road.jenisjalan_id * 2.8}
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

        {/* Legend */}
        <Legend />
      </div>
    </div>
  );
}
