import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting to clear the database...");

  const modelNames = ["Message", "Conversation", "User"];

  await prisma.$transaction(
    modelNames.map((modelName) =>
      prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${modelName}" RESTART IDENTITY CASCADE;`
      )
    )
  );

  console.log("Database clearing complete.");
}

main()
  .catch((e) => {
    console.error("An error occurred while clearing the database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
