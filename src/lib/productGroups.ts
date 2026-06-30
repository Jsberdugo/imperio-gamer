// src/lib/productGroups.ts
import { publicClient, type ApiOk } from "./http";

export interface ProductGroup {
  slug: string | undefined;
  id: string;
  nombre: string; // matchea con Product.grupo
  logoUrl?: string | null;
  color: string;
  instrucciones: string;
}

const norm = (s?: string | null) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const BLOCKED_GROUP_NAME = norm("Free Fire Game FAN");

const PRIORITY_RULES: Array<(name: string) => boolean> = [
  (n) => n.includes("free fire") && n.includes("latam"),
  (n) =>
    n.includes("razer") &&
    n.includes("gold") &&
    (n.includes("co") || n.includes("colombia")),
  (n) =>
    n.includes("smile") &&
    n.includes("one") &&
    (n.includes("br") || n.includes("brasil") || n.includes("brazil")),
  (n) => n.includes("roblox"),
  (n) => n.includes("apple") && (n.includes("usa") || n.includes("us")),
  (n) =>
    (n.includes("play") &&
      n.includes("station") &&
      (n.includes("usa") || n.includes("us"))) ||
    n.includes("playstation"),
  (n) => n.includes("steam") && (n.includes("usa") || n.includes("us")),
  (n) => n.includes("netflix") && (n.includes("usa") || n.includes("us")),
];

function getPriorityIndex(groupName: string) {
  const n = norm(groupName);
  const idx = PRIORITY_RULES.findIndex((fn) => fn(n));
  return idx === -1 ? Number.POSITIVE_INFINITY : idx;
}

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function sortGroupsForUI(groups: ProductGroup[]) {
  return [...groups].sort((a, b) => {
    const pa = getPriorityIndex(a.nombre);
    const pb = getPriorityIndex(b.nombre);
    if (pa !== pb) return pa - pb;
    return collator.compare(a.nombre, b.nombre);
  });
}

export async function getProductGroups(): Promise<ProductGroup[]> {
  const res = await publicClient.get<ApiOk<ProductGroup[]>>("/product-groups");
  const items = (res.data as any)?.data;

  const groups = Array.isArray(items) ? (items as ProductGroup[]) : [];

  const filtered = groups.filter((g) => norm(g?.nombre) !== BLOCKED_GROUP_NAME);

  return sortGroupsForUI(filtered);
}
