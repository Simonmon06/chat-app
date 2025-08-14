export type DisplayNameInput = {
  username: string;
  nickname?: string | null;
} | null;

export function getDisplayName(u: DisplayNameInput) {
  if (!u) return "";
  const n = u.nickname?.trim();
  return n && n.length > 0 ? n : u.username;
}
