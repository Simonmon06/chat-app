import prisma from "./db/prisma.js"; // 导入你配置好的 prisma 实例

async function testQuery() {
  console.log("--- Starting standalone Prisma test ---");

  const userCount = await prisma.user.count();
  console.log(`Found ${userCount} users.`);

  const oneUser = await prisma.user.findFirst();
  console.log("Found one user:", oneUser);

  console.log("--- Test finished ---");
}

testQuery()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
