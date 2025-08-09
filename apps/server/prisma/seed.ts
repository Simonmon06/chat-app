import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

function dmKeyOf(a: string, b: string) {
  if (a === b) return `self:${a}`;
  const [x, y] = [a, b].sort();
  return `${x}:${y}`;
}

async function main() {
  const [alice, bob] = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@test.com" },
      update: {},
      create: {
        email: "alice@test.com",
        username: "alice",
        password: await bcrypt.hash("pass123", 10),
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@test.com" },
      update: {},
      create: {
        email: "bob@test.com",
        username: "bob",
        password: await bcrypt.hash("pass123", 10),
      },
    }),
  ]);

  const key = dmKeyOf(alice.id, bob.id);
  const conv = await prisma.conversation.upsert({
    where: { dmKey: key },
    update: {},
    create: {
      isGroup: false,
      dmKey: key,
      participants: { create: [{ userId: alice.id }, { userId: bob.id }] },
    },
  });

  await prisma.$transaction([
    prisma.message.createMany({
      data: [
        { conversationId: conv.id, senderId: alice.id, content: "hi" },
        { conversationId: conv.id, senderId: bob.id, content: "hey!" },
      ],
    }),
    prisma.conversation.update({
      where: { id: conv.id },
      data: { updatedAt: new Date() },
    }),
  ]);
}
main().finally(() => prisma.$disconnect());
