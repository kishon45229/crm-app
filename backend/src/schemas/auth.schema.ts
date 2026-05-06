import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    userName: z.string().min(1).optional(),
    // Back-compat: older clients may send `name`; we map it to `userName`.
    name: z.string().min(1).optional(),
  })
  .refine((v) => typeof v.userName === "string" || typeof v.name === "string", {
    message: "Either userName or name is required",
    path: ["userName"],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z
  .object({
    refreshToken: z.string().min(1).optional(),
  })
  .default({});

export const logoutSchema = z
  .object({
    refreshToken: z.string().min(1).optional(),
  })
  .default({});
