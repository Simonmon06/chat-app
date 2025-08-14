export function dmKeyOf(a: string, b: string) {
  if (a === b) return `self:${a}`;
  const [x, y] = [a, b].sort();
  return `${x}:${y}`;
}
