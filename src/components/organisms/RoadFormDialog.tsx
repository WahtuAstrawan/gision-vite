import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { addRoad, updateRoadById } from "@/lib/api";
import { getDashArray, getPolylineLength, getRoadColor } from "@/lib/utils";
import { roadSchema, type RoadFormData } from "@/lib/validators";
import { useAuthStore } from "@/stores/authStore";
import "@geoman-io/leaflet-geoman-free";
import { zodResolver } from "@hookform/resolvers/zod";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import { MapDraw } from "../atoms/MapDraw";

interface RoadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  allRegion: RegionResponse;
  roadMaterial: RoadMaterial[];
  roadType: RoadTypeItem[];
  roadCondition: RoadConditionItem[];
  initialData?: RoadFormData & { id: number };
}

const RoadFormDialog: React.FC<RoadFormDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  allRegion,
  roadMaterial,
  roadType,
  roadCondition,
  initialData,
}) => {
  const { token } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [selectedDesa, setSelectedDesa] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [selectedRoadType, setSelectedRoadType] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([-8.65, 115.22]);
  const [decodedPath, setDecodedPath] = useState<[number, number][]>([]);
  const [roadColor, setRoadColor] = useState<string>("black");
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");

  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RoadFormData>({
    resolver: zodResolver(roadSchema),
    defaultValues: initialData || {
      paths: "",
      desa_id: 0,
      kode_ruas: "",
      nama_ruas: "",
      panjang: 0,
      lebar: 0,
      eksisting_id: 0,
      kondisi_id: 0,
      jenisjalan_id: 0,
      keterangan: "",
    },
  });

  const roadTypeForm = watch("jenisjalan_id");

  const resetFormFields = () => {
    setValue("paths", "");
    setValue("kode_ruas", "");
    setValue("nama_ruas", "");
    setValue("keterangan", "");
    setValue("panjang", 0);
    setValue("lebar", 0);
    setValue("desa_id", 0);
    setValue("eksisting_id", 0);
    setValue("kondisi_id", 0);
    setValue("jenisjalan_id", 0);

    setSelectedDesa("");
    setSelectedMaterial("");
    setSelectedCondition("");
    setSelectedRoadType("");
    setSelectedKabupaten("");
    setSelectedKecamatan("");
  };

  const onSubmit = async (data: RoadFormData) => {
    setError(null);
    try {
      if (isEditMode) {
        await updateRoadById(initialData!.id, data, token || "");
      } else {
        await addRoad(data, token || "");
      }
      resetFormFields();
      setDecodedPath([]);
      setMapCenter([-8.65, 115.22]);
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(
        `Failed to ${isEditMode ? "update" : "add"} road. Please try again.`
      );
    }
  };

  useEffect(() => {
    setRoadColor(getRoadColor(roadTypeForm));
  }, [roadTypeForm]);

  useEffect(() => {
    if (initialData) {
      setValue("paths", initialData.paths);
      setValue("kode_ruas", initialData.kode_ruas);
      setValue("nama_ruas", initialData.nama_ruas);
      setValue("keterangan", initialData.keterangan);
      setValue("panjang", initialData.panjang);
      setValue("lebar", initialData.lebar);
      setValue("desa_id", initialData.desa_id);
      setValue("eksisting_id", initialData.eksisting_id);
      setValue("kondisi_id", initialData.kondisi_id);
      setValue("jenisjalan_id", initialData.jenisjalan_id);

      setSelectedDesa(
        allRegion.desa.find((d) => d.id === initialData.desa_id)?.desa || ""
      );
      setSelectedMaterial(
        roadMaterial.find((m) => m.id === initialData.eksisting_id)
          ?.eksisting || ""
      );
      setSelectedCondition(
        roadCondition.find((c) => c.id === initialData.kondisi_id)?.kondisi ||
          ""
      );
      setSelectedRoadType(
        roadType.find((t) => t.id === initialData.jenisjalan_id)?.jenisjalan ||
          ""
      );

      if (initialData.paths) {
        const decoded = polyline.decode(initialData.paths) as [
          number,
          number
        ][];
        setDecodedPath(decoded);
        if (decoded.length > 0) {
          const midIdx = Math.floor(decoded.length / 2);
          setMapCenter([decoded[midIdx][0], decoded[midIdx][1]]);
        }
      }
    } else {
      resetFormFields();
      setDecodedPath([]);
      setMapCenter([-8.65, 115.22]);
    }
  }, [initialData]);

  const filteredKecamatan = allRegion.kecamatan.filter(
    (k) =>
      allRegion.kabupaten.find((kab) => kab.id === k.kab_id)?.kabupaten ===
      selectedKabupaten
  );

  const filteredDesa = allRegion.desa.filter(
    (d) =>
      allRegion.kecamatan.find((kec) => kec.id === d.kec_id)?.kecamatan ===
      selectedKecamatan
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[95vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="my-1">
            {isEditMode ? "Update Road" : "Add Road"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Map Component */}
          <div className="h-90 space-y-2">
            <MapContainer
              center={mapCenter}
              zoom={13}
              className="h-full w-full rounded-xl"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapDraw
                setPath={(encodedPath) => {
                  setValue("paths", encodedPath);

                  const decoded = polyline.decode(encodedPath) as [
                    number,
                    number
                  ][];
                  setDecodedPath(decoded);

                  if (decoded.length > 0) {
                    const length = getPolylineLength(decoded);
                    setValue("panjang", parseFloat(length.toFixed(0)));
                  }
                }}
              />
              {decodedPath.length > 0 && (
                <Polyline
                  key={`${decodedPath}-${roadColor}-${getDashArray(
                    selectedCondition
                  )}`}
                  positions={decodedPath}
                  color={roadColor}
                  dashArray={getDashArray(selectedCondition)}
                />
              )}
            </MapContainer>
            {errors.paths && (
              <p className="text-sm text-red-500">{errors.paths.message}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 mt-6">
              <Label htmlFor="kode_ruas">Road Code</Label>
              <Input id="kode_ruas" {...register("kode_ruas")} />
              {errors.kode_ruas && (
                <p className="text-sm text-red-500">
                  {errors.kode_ruas.message}
                </p>
              )}
            </div>
            <div className="space-y-2 mt-6">
              <Label htmlFor="nama_ruas">Road Name</Label>
              <Input id="nama_ruas" {...register("nama_ruas")} />
              {errors.nama_ruas && (
                <p className="text-sm text-red-500">
                  {errors.nama_ruas.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="panjang">Length (m)</Label>
              <Input
                type="number"
                id="panjang"
                disabled
                {...register("panjang", { valueAsNumber: true })}
              />
              {errors.panjang && (
                <p className="text-sm text-red-500">{errors.panjang.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lebar">Width (m)</Label>
              <Input
                type="number"
                id="lebar"
                {...register("lebar", { valueAsNumber: true })}
              />
              {errors.lebar && (
                <p className="text-sm text-red-500">{errors.lebar.message}</p>
              )}
            </div>
            {/* KABUPATEN */}
            <div className="space-y-2">
              <Label htmlFor="kabupaten">Kabupaten</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedKabupaten(value);
                  setSelectedKecamatan("");
                  setSelectedDesa("");
                  setValue("desa_id", 0);
                }}
              >
                <SelectTrigger id="kabupaten">
                  {selectedKabupaten || "Select Kabupaten"}
                </SelectTrigger>
                <SelectContent>
                  {allRegion.kabupaten.map((kab) => (
                    <SelectItem key={kab.id} value={kab.kabupaten}>
                      {kab.kabupaten}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* KECAMATAN */}
            <div className="space-y-2">
              <Label htmlFor="kecamatan">Kecamatan</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedKecamatan(value);
                  setSelectedDesa("");
                  setValue("desa_id", 0);
                }}
                disabled={!selectedKabupaten}
              >
                <SelectTrigger id="kecamatan">
                  {selectedKecamatan || "Select Kecamatan"}
                </SelectTrigger>
                <SelectContent>
                  {filteredKecamatan.map((kec) => (
                    <SelectItem key={kec.id} value={kec.kecamatan}>
                      {kec.kecamatan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* DESA */}
            <div className="space-y-2">
              <Label htmlFor="desa_id">Desa</Label>
              <Select
                onValueChange={(value) => {
                  const selected = allRegion.desa.find(
                    (desa) => desa.id.toString() === value
                  );
                  setSelectedDesa(selected?.desa || "");
                  setValue("desa_id", parseInt(value));
                }}
                disabled={!selectedKecamatan}
              >
                <SelectTrigger id="desa_id">
                  {selectedDesa || "Select Desa"}
                </SelectTrigger>
                <SelectContent>
                  {filteredDesa.map((desa) => (
                    <SelectItem key={desa.id} value={desa.id.toString()}>
                      {desa.desa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.desa_id && (
                <p className="text-sm text-red-500">{errors.desa_id.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="eksisting_id">Material</Label>
              <Select
                onValueChange={(value) => {
                  const selected = roadMaterial.find(
                    (material) => material.id.toString() === value
                  );
                  setSelectedMaterial(selected?.eksisting || "");
                  setValue("eksisting_id", parseInt(value));
                }}
              >
                <SelectTrigger id="eksisting_id">
                  {selectedMaterial || "Select Material"}
                </SelectTrigger>
                <SelectContent>
                  {roadMaterial.map((material) => (
                    <SelectItem
                      key={material.id}
                      value={material.id.toString()}
                    >
                      {material.eksisting}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.eksisting_id && (
                <p className="text-sm text-red-500">
                  {errors.eksisting_id.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="kondisi_id">Condition</Label>
              <Select
                onValueChange={(value) => {
                  const selected = roadCondition.find(
                    (condition) => condition.id.toString() === value
                  );
                  setSelectedCondition(selected?.kondisi || "");
                  setValue("kondisi_id", parseInt(value));
                }}
              >
                <SelectTrigger id="kondisi_id">
                  {selectedCondition || "Select Condition"}
                </SelectTrigger>
                <SelectContent>
                  {roadCondition.map((condition) => (
                    <SelectItem
                      key={condition.id}
                      value={condition.id.toString()}
                    >
                      {condition.kondisi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kondisi_id && (
                <p className="text-sm text-red-500">
                  {errors.kondisi_id.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="jenisjalan_id">Road Type</Label>
              <Select
                onValueChange={(value) => {
                  const selected = roadType.find(
                    (type) => type.id.toString() === value
                  );
                  setSelectedRoadType(selected?.jenisjalan || "");
                  setValue("jenisjalan_id", parseInt(value));
                }}
              >
                <SelectTrigger id="jenisjalan_id">
                  {selectedRoadType || "Select Road Type"}
                </SelectTrigger>
                <SelectContent>
                  {roadType.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.jenisjalan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.jenisjalan_id && (
                <p className="text-sm text-red-500">
                  {errors.jenisjalan_id.message}
                </p>
              )}
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="keterangan">Description</Label>
              <Input id="keterangan" {...register("keterangan")} />
              {errors.keterangan && (
                <p className="text-sm text-red-500">
                  {errors.keterangan.message}
                </p>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-y-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isEditMode ? "Updating..." : "Saving..."}
                </span>
              ) : isEditMode ? (
                "Update Road"
              ) : (
                "Save Road"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoadFormDialog;
