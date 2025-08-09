import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "event" },
    { level: "error", emit: "event" },
    { level: "warn", emit: "event" },
    { level: "info", emit: "event" },
  ],
});

prisma.$on("query", (e) => {
  console.log(`[Prisma Query] ${e.query}`);
  console.log(`[Prisma Params] ${e.params}`);
  console.log(`[Prisma Duration] ${e.duration}ms`);
});

export default prisma;
