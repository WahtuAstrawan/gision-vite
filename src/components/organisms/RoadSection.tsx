import ViewMapDialog from '@/components/molecules/ViewMapDialog';
import { Button } from '@/components/ui/button';
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
import { useAuthStore } from '@/stores/authStore';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import { Loader2, Pencil, Plus, Trash } from 'lucide-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ConfirmDialog from '../atoms/ConfirmDialog';
import RoadFormDialog from '../molecules/RoadFormDialog';

const RoadSection = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedRoadForMap, setSelectedRoadForMap] =
    React.useState<Road | null>(null);
  const [selectedRoadForEdit, setSelectedRoadForEdit] =
    React.useState<Road | null>(null);
  const [roadToDelete, setRoadToDelete] = React.useState<Road | null>(null);
  const [roads, setRoads] = React.useState<Road[]>([]);
  const [roadMaterial, setRoadMaterial] = React.useState<RoadMaterial[]>([]);
  const [roadType, setRoadType] = React.useState<RoadTypeItem[]>([]);
  const [roadCondition, setRoadCondition] = React.useState<RoadConditionItem[]>(
    []
  );
  const [allRegion, setAllRegion] = React.useState<RegionResponse>();

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

  const refreshRoadList = async () => {
    await handleApi(getAllRoads, (res: AllRoadsResponse) =>
      setRoads(res.ruasjalan || [])
    );
  };

  const handleDelete = async () => {
    if (!roadToDelete) return;

    try {
      const res = await deleteRoadById(roadToDelete.id, token || '');
      if (res.code === 200) {
        toast.success('Road deleted successfully!');
        refreshRoadList();
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

  React.useEffect(() => {
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

  const findName = (list: any[], id: number, key: string) =>
    list.find((item) => item.id === id)?.[key] || '-';

  const getMaterialName = (id: number) =>
    findName(roadMaterial, id, 'eksisting');
  const getConditionName = (id: number) =>
    findName(roadCondition, id, 'kondisi');
  const getTypeName = (id: number) => findName(roadType, id, 'jenisjalan');
  const getVillageName = (id: number) =>
    allRegion?.desa.find((d) => d.id === id)?.desa || '-';

  if (loading)
    return (
      <div className="flex m-5 justify-center">
        <Loader2 className="mx-2 animate-spin" />
        Loading roads data...
      </div>
    );

  if (error)
    return <div className="text-red-500 flex m-5 justify-center">{error}</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead className="text-center">Village</TableHead>
            <TableHead className="text-center">Length (m)</TableHead>
            <TableHead className="text-center">Width (m)</TableHead>
            <TableHead className="text-center">Material</TableHead>
            <TableHead className="text-center">Condition</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Path</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roads.map((road) => (
            <TableRow key={road.id}>
              <TableCell>{road.kode_ruas}</TableCell>
              <TableCell>{road.nama_ruas}</TableCell>
              <TableCell className="truncate max-w-[300px] whitespace-nowrap overflow-hidden">
                {road.keterangan}
              </TableCell>
              <TableCell className="text-center">
                {getVillageName(road.desa_id)}
              </TableCell>
              <TableCell className="text-center">{road.panjang}</TableCell>
              <TableCell className="text-center">{road.lebar}</TableCell>
              <TableCell className="text-center">
                {getMaterialName(road.eksisting_id)}
              </TableCell>
              <TableCell className="text-center">
                {getConditionName(road.kondisi_id)}
              </TableCell>
              <TableCell className="text-center">
                {getTypeName(road.jenisjalan_id)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRoadForMap(road)}
                >
                  View
                </Button>
              </TableCell>
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
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="hover:bg-red-400"
                    onClick={() => setRoadToDelete(road)}
                  >
                    <Trash />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        className="fixed bottom-7 right-7 rounded-xl h-12 w-12 p-0 text-white hover:bg-primary/90"
        onClick={() => {
          setSelectedRoadForEdit(null);
          setOpenDialog(true);
        }}
      >
        <Plus className="h-8 w-8" />
      </Button>
      {selectedRoadForMap && (
        <ViewMapDialog
          open={!!selectedRoadForMap}
          onOpenChange={() => setSelectedRoadForMap(null)}
          paths={selectedRoadForMap.paths}
          roadName={selectedRoadForMap.nama_ruas}
          roadType={selectedRoadForMap.jenisjalan_id}
        />
      )}
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
            refreshRoadList();
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
  );
};

export default RoadSection;
