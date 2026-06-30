import { publicClient, type ApiOk } from "./http";

export type BannerType = "IMAGE" | "TEXT";

export type Banner = {
  id: string;
  dispo: boolean;
  type: BannerType;

  titulo: string;
  descripcion: string;
  imagen?: string | null;

  productGroupId?: string | null;

  createdAt: string;
  updatedAt: string;
};

type ProductGroup = {
  id: string;
  nombre: string;
};

const norm = (s?: string | null) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

async function getProductGroupsSafe(): Promise<ProductGroup[]> {
  try {
    const { data } = await publicClient.get<ApiOk<ProductGroup[]>>("/product-groups");
    return ((data as any).data ?? (data as any)) as ProductGroup[];
  } catch {
    return [];
  }
}

// Free Fire primero, luego recientes
function sortBannersFreeFireFirst(
  banners: Banner[],
  groupNameById: Map<string, string>
) {
  const isFreeFire = (b: Banner) => {
    const gid = b.productGroupId ?? "";
    const name = groupNameById.get(gid) ?? "";
    return norm(name).includes("free fire") || norm(name) === "free fire";
  };

  return [...banners].sort((a, b) => {
    const af = isFreeFire(a) ? 1 : 0;
    const bf = isFreeFire(b) ? 1 : 0;

    if (af !== bf) return bf - af;

    const ad = Date.parse(a.createdAt || "") || 0;
    const bd = Date.parse(b.createdAt || "") || 0;
    return bd - ad;
  });
}

async function getActiveBannersBase(): Promise<Banner[]> {
  const { data } = await publicClient.get<ApiOk<Banner[]>>("/banners/activos");
  const bannersRaw = ((data as any).data ?? (data as any)) as Banner[];
  const banners = Array.isArray(bannersRaw) ? bannersRaw : [];

  const groups = await getProductGroupsSafe();
  const groupNameById = new Map<string, string>();
  for (const g of groups) {
    groupNameById.set(g.id, g.nombre);
  }

  return sortBannersFreeFireFirst(banners, groupNameById);
}

// Para hero/carruseles de imagen
export async function getActiveImageBanners(): Promise<Banner[]> {
  const banners = await getActiveBannersBase();
  return banners.filter((b) => b.type === "IMAGE" && !!b.imagen);
}

// Para announcement bar
export async function getActiveTextBanners(): Promise<Banner[]> {
  const banners = await getActiveBannersBase();
  return banners.filter(
    (b) =>
      b.type === "TEXT" &&
      (norm(b.titulo).length > 0 || norm(b.descripcion).length > 0)
  );
}

// Si en alguna parte sigues usando el nombre viejo
export async function getActiveBanners(): Promise<Banner[]> {
  return getActiveImageBanners();
}