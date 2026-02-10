// Prisma configuration for Eva Accessories
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DATABASE_URL from environment, fallback to Docker for local dev
    url: process.env.DATABASE_URL || "postgresql://eva:eva_secret_2026@localhost:5432/eva_accessories?schema=public",
  },
});
