const TITLES = ["md", "md.", "mohammad", "muhammad", "mst", "mst.", "mrs", "mr", "mr.", "ms", "ms."];

export function firstName(full) {
  if (!full) return "there";
  const parts = full.trim().split(/\s+/);
  const i = TITLES.includes(parts[0].toLowerCase()) && parts.length > 1 ? 1 : 0;
  return parts[i];
}

export function initials(full) {
  if (!full) return "?";
  const parts = full.trim().split(/\s+/);
  const start = TITLES.includes(parts[0].toLowerCase()) && parts.length > 1 ? 1 : 0;
  return parts.slice(start, start + 2).map((w) => w[0]).join("").toUpperCase();
}
