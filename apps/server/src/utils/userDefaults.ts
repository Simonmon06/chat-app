export function deriveNickname(input: { username?: string; email?: string }) {
  const seed = input.username?.trim() || input.email?.split("@")[0] || "user";

  const s = seed
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || "User";
}

export function makeAvatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/icons/svg?seed=${encodeURIComponent(
    seed
  )}`;
}
