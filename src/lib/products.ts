// src/lib/products.ts
import { publicClient, type ApiOk } from "./http";

export interface Product {
  id: string;
  nombre: string;
  precio: number | string;
  disponible: boolean;
  automatico: boolean;
  grupo: string | null;
  hot: boolean;
  logoUrl: string;
  coverUrl: string;

  limiteCompra: number;

  minimoCompra?: number;
  minimoInventario?: number;
}

const PRODUCT_PRIORITY = [
  "Free Fire (LATAM)",
  "Razer Gold (CO - Colombia)",
  "Smile One (BR)",
  "Gift Card Roblox",
  "Apple USA",
  "Play Station USA",
  "Steam (US)",
  "Netflix USA",
] as const;

function norm(s?: string | null) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const PRIORITY_INDEX = new Map<string, number>(
  PRODUCT_PRIORITY.map((name, i) => [norm(name), i])
);

function tokenizeNatural(s: string): Array<string | number> {
  const out: Array<string | number> = [];
  norm(s).replace(/(\d+)|(\D+)/g, (_m: string, num?: string, text?: string) => {
    out.push(num ? Number(num) : text ?? "");
    return "";
  });
  return out;
}

function naturalCompare(a: string, b: string): number {
  const ax = tokenizeNatural(a);
  const bx = tokenizeNatural(b);

  const len = Math.max(ax.length, bx.length);
  for (let i = 0; i < len; i++) {
    const an = ax[i];
    const bn = bx[i];

    if (an === undefined) return -1;
    if (bn === undefined) return 1;

    if (typeof an === "number" && typeof bn === "number") {
      if (an !== bn) return an - bn;
    } else {
      const sa = String(an);
      const sb = String(bn);
      if (sa !== sb) return sa.localeCompare(sb);
    }
  }
  return 0;
}

function sortByPriorityThenNaturalName(a: Product, b: Product) {
  const pa = PRIORITY_INDEX.get(norm(a.nombre));
  const pb = PRIORITY_INDEX.get(norm(b.nombre));

  const ra = pa ?? Number.POSITIVE_INFINITY;
  const rb = pb ?? Number.POSITIVE_INFINITY;

  if (ra !== rb) return ra - rb;
  return naturalCompare(a.nombre, b.nombre);
}

function applyPrioritySort(items: Product[]) {
  return [...items].sort(sortByPriorityThenNaturalName);
}

export async function getAllProducts(): Promise<Product[]> {
  const res = await publicClient.get<ApiOk<Product[]>>("/products");
  return applyPrioritySort(res.data.data);
}

export async function getAvailableProducts(): Promise<Product[]> {
  const res = await publicClient.get<ApiOk<Product[]>>("/products/disponibles");
  return applyPrioritySort(res.data.data);
}

export async function getProductsByGroup(grupo: string): Promise<Product[]> {
  const res = await publicClient.get<ApiOk<Product[]>>(
    `/products/grupo/${encodeURIComponent(grupo)}`
  );
  return applyPrioritySort(res.data.data);
}

export async function getProductById(id: string): Promise<Product> {
  const res = await publicClient.get<ApiOk<Product>>(`/products/${id}`);
  return res.data.data;
}

export async function getHotProducts(): Promise<Product[]> {
  const res = await publicClient.get<ApiOk<Product[]>>("/products/hot/only");
  return applyPrioritySort(res.data.data);
}
