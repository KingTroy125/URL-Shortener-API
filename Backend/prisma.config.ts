import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma configuration for connecting to MongoDB using the MONGO_URI environment variable
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("MONGO_URI"),
  },
});