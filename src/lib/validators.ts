import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email harus valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  email: z.string().email({ message: "Email harus valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});
