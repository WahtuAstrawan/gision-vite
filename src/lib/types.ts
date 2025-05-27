export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AddRoadRequest = {
  paths: string;
  desa_id: number;
  kode_ruas: string;
  nama_ruas: string;
  panjang: number;
  lebar: number;
  eksisting_id: number;
  kondisi_id: number;
  jenisjalan_id: number;
  keterangan: string;
};

export type RegionResponse = {
  code: number;
  status: string;
  provinsi: { id: number; provinsi: string }[];
  kabupaten: { id: number; prov_id: number; kabupaten: string }[];
  kecamatan: { id: number; kab_id: number; kecamatan: string }[];
  desa: { id: number; kec_id: number; desa: string }[];
};

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Meta = {
  code: number;
  message: string;
};

export type UserResponse = {
  meta: Meta;
  data: {
    user: User;
  };
};

export type Road = {
  id: number;
  paths: string;
  desa_id: number;
  kode_ruas: string;
  nama_ruas: string;
  panjang: number;
  lebar: number;
  eksisting_id: number;
  kondisi_id: number;
  jenisjalan_id: number;
  keterangan: string;
};

export type AllRoadsResponse = {
  code: number;
  user: User;
  "token-expired": number;
  status: string;
  ruasjalan: Road[];
};

export type RoadMaterial = {
  id: number;
  eksisting: string;
};

export type RoadMaterialResponse = {
  code: number;
  "token-expired": number;
  status: string;
  eksisting: RoadMaterial[];
};

export type RoadTypeItem = {
  id: number;
  jenisjalan: string;
};

export type RoadType = {
  code: number;
  "token-expired": number;
  status: string;
  eksisting: RoadTypeItem[];
};

export type RoadConditionItem = {
  id: number;
  kondisi: string;
};

export type RoadCondition = {
  code: number;
  "token-expired": number;
  status: string;
  eksisting: RoadConditionItem[];
};
