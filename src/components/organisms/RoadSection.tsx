import ViewMapDialog from "@/components/molecules/ViewMapDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteRoadById,
  getAllRegion,
  getAllRoads,
  getRoadCondition,
  getRoadMaterial,
  getRoadType,
} from "@/lib/api";
import { findName, handleApi } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";
import { Pencil, Plus, Trash } from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ConfirmDialog from "../atoms/ConfirmDialog";
import Loading from "../atoms/Loading";
import { PaginationControls } from "../atoms/PaginationControls";
import { SearchInputWithClear } from "../atoms/SearchInputWithClear";
import RoadFormDialog from "./RoadFormDialog";
import ShowDialog from "../atoms/ShowDialog";

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
  const [descToShow, setDescToShow] = React.useState<string | null>(null);

  const [roads, setRoads] = React.useState<Road[]>([]);
  const [roadMaterial, setRoadMaterial] = React.useState<RoadMaterial[]>([]);
  const [roadType, setRoadType] = React.useState<RoadTypeItem[]>([]);
  const [roadCondition, setRoadCondition] = React.useState<RoadConditionItem[]>(
    []
  );
  const [allRegion, setAllRegion] = React.useState<RegionResponse>();

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredRoads, setFilteredRoads] = React.useState<Road[]>([]);

  const refreshRoadList = async () => {
    setCurrentPage(1);
    await handleApi(
      getAllRoads,
      token || "",
      (res: AllRoadsResponse) => setRoads(res.ruasjalan || []),
      {
        onError: setError,
        onExpired: () => setTimeout(() => navigate("/"), 2000),
      }
    );
  };

  const applySearch = () => {
    const lowerQuery = searchQuery.toLowerCase();

    const result = roads.filter((road) => {
      const villageName = getVillageName(road.desa_id).toLowerCase();
      return (
        road.kode_ruas.toLowerCase().includes(lowerQuery) ||
        road.nama_ruas.toLowerCase().includes(lowerQuery) ||
        villageName.includes(lowerQuery)
      );
    });

    setFilteredRoads(result);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleDelete = async () => {
    if (!roadToDelete) return;

    try {
      const res = await deleteRoadById(roadToDelete.id, token || "");
      if (res.code === 200) {
        toast.success("Road deleted successfully!");
        refreshRoadList();
      } else {
        toast.error("Failed to delete road.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during deletion.");
    } finally {
      setRoadToDelete(null);
    }
  };

  React.useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        handleApi(
          getAllRoads,
          token || "",
          (res) => setRoads(res.ruasjalan || []),
          {
            onError: setError,
            onExpired: () => setTimeout(() => navigate("/"), 2000),
          }
        ),
        handleApi(
          getRoadMaterial,
          token || "",
          (res) => setRoadMaterial(res.eksisting || []),
          {
            onError: setError,
          }
        ),
        handleApi(
          getRoadType,
          token || "",
          (res) => setRoadType(res.eksisting || []),
          {
            onError: setError,
          }
        ),
        handleApi(
          getRoadCondition,
          token || "",
          (res) => setRoadCondition(res.eksisting || []),
          {
            onError: setError,
          }
        ),
        handleApi(getAllRegion, token || "", setAllRegion, {
          onError: setError,
        }),
      ]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const getMaterialName = (id: number) =>
    findName(roadMaterial, id, "eksisting");
  const getConditionName = (id: number) =>
    findName(roadCondition, id, "kondisi");
  const getTypeName = (id: number) => findName(roadType, id, "jenisjalan");
  const getVillageName = (id: number) =>
    findName(allRegion?.desa || [], id, "desa");
  const totalPages = Math.ceil(filteredRoads.length / itemsPerPage);
  const paginatedRoads = filteredRoads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  React.useEffect(() => {
    applySearch();
  }, [roads, searchQuery]);

  if (loading) return <Loading loadingText="Loading roads data..." />;

  if (error)
    return <div className="text-red-500 flex m-5 justify-center">{error}</div>;

  return (
    <>
      <div className="pt-4">
        <SearchInputWithClear
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={handleClear}
          placeholder="Search code, name, or village"
        />
      </div>
      <div className="text-sm text-gray-600 my-2">
        Showing {paginatedRoads.length} of {filteredRoads.length} roads
        {filteredRoads.length !== roads.length &&
          ` (filtered from ${roads.length} total)`}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead className="text-center">Village</TableHead>
            <TableHead className="text-center">Length (km)</TableHead>
            <TableHead className="text-center">Width (m)</TableHead>
            <TableHead className="text-center">Material</TableHead>
            <TableHead className="text-center">Condition</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Path</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRoads.length > 0 ? (
            paginatedRoads.map((road) => (
              <TableRow key={road.id}>
                <TableCell>{road.kode_ruas}</TableCell>
                <TableCell>{road.nama_ruas}</TableCell>
                <TableCell
                  className="truncate max-w-[300px] whitespace-nowrap overflow-hidden hover:cursor-pointer"
                  onClick={() => setDescToShow(road.keterangan)}
                >
                  {road.keterangan}
                </TableCell>
                <TableCell className="text-center">
                  {getVillageName(road.desa_id)}
                </TableCell>
                <TableCell className="text-center">
                  {road.panjang / 1000}
                </TableCell>
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
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={11}
                className="text-center py-4 text-gray-500"
              >
                No roads found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

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
          conditionId={selectedRoadForMap.kondisi_id}
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
                ? "Road updated successfully!"
                : "Road added successfully!"
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
      <ShowDialog
        open={!!descToShow}
        onOpenChange={(open) => {
          if (!open) setDescToShow(null);
        }}
        title={"Description"}
        description={descToShow || "-"}
      />
    </>
  );
};

export default RoadSection;
