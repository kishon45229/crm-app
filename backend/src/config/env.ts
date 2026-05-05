import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z
    .string()
    .default("4000")
    .transform((value) => Number(value)),
  DATABASE_URL: z.string(),
  CORS_ORIGIN: z.string().default("http://localhost:3000")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

const raw = parsed.data;

export const env = { ...raw };