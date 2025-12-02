export function avatarUrlForUser(userId?: string) {
  if (!userId) return "";
  const base = import.meta.env.VITE_API_BASE_URL || "";
  return `${base}/api/avatars/${userId}`;
}
