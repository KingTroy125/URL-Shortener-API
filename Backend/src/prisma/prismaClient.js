import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;

// Ensure the Prisma Accelerate URL is provided
if (!accelerateUrl) {
  throw new Error("Missing PRISMA_ACCELERATE_URL. Prisma 7 with MongoDB requires a Prisma Accelerate URL.");
}

// Initialize Prisma Client with Accelerate extension
const prisma = new PrismaClient({
  accelerateUrl,
}).$extends(withAccelerate());

export default prisma;
