import prisma from "../db/prisma.js";

// 生成/校验可用的用户名，供 Google 登录自动创建账号时使用。

const RESERVED_USERNAMES = new Set([
  "admin",
  "support",
  "root",
  "api",
  "me",
  "self",
]);

export function isReservedUsername(username: string) {
  return RESERVED_USERNAMES.has(username.toLowerCase());
}

//("John.Doe+123") -> john-doe-123
function normalizeUsername(seed: string) {
  const base = seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return base || "user";
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 6);
}

export async function findAvailableUsername(input: {
  email?: string | null;
  name?: string | null;
}) {
  const seed =
    input.email?.split("@")[0]?.trim() || input.name?.trim() || "user";

  const base = normalizeUsername(seed);
  let candidate = base;

  for (let i = 0; i < 6; i++) {
    if (!isReservedUsername(candidate)) {
      const existing = await prisma.user.findUnique({
        where: { username: candidate },
        select: { id: true },
      });
      if (!existing) return candidate;
    }
    candidate = `${base}-${randomSuffix()}`;
  }

  return `${base}-${Date.now().toString(36).slice(-4)}`;
}
