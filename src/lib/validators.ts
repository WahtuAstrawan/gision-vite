import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email must be valid" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Email must be valid" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const roadSchema = z.object({
  paths: z.string().min(1, "Path is required"),
  desa_id: z.number().int().min(1, "Village is required"),
  kode_ruas: z.string().min(1, "Road code is required"),
  nama_ruas: z.string().min(1, "Road name is required"),
  panjang: z.number().positive("Length must be positive"),
  lebar: z.number().positive("Width must be positive"),
  eksisting_id: z.number().int().min(1, "Material is required"),
  kondisi_id: z.number().int().min(1, "Condition is required"),
  jenisjalan_id: z.number().int().min(1, "Road type is required"),
  keterangan: z.string().min(1, "Description is required"),
});

export type RoadFormData = z.infer<typeof roadSchema>;
