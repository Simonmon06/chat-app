export function avatarUrlForUser(userId?: string) {
  if (!userId) return "";
  return `/api/avatars/${userId}`;
}
