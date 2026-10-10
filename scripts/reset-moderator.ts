/// <reference types="node" />

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import argon2 from "argon2";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaNeon({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "moderator@whistledrop.com";

  const newPassword = "whistledrop@2007";

  const passwordHash = await argon2.hash(newPassword);

  const moderator = await prisma.moderator.upsert({
    where: {
      email,
    },
    update: {
      passwordHash,
    },
    create: {
      email,
      passwordHash,
      role: "MODERATOR",
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log("Moderator account is ready.");
  console.log(moderator);
}

main()
  .catch((error) => {
    console.error("Moderator setup failed:");
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    console.error("Full error:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });