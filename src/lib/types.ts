export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegionResponse = {
  code: number;
  status: string;
  provinsi: { id: number; provinsi: string }[];
  kabupaten: { id: number; prov_id: number; kabupaten: string }[];
  kecamatan: { id: number; kab_id: number; kecamatan: string }[];
  desa: { id: number; kec_id: number; desa: string }[];
};
