// Importa `clsx` y `ClassValue` desde la librería "clsx" para manejar clases condicionales de CSS
import { clsx, type ClassValue } from "clsx";
// Importa `twMerge` desde "tailwind-merge" para combinar clases de Tailwind y eliminar duplicados/conflictos
import { twMerge } from "tailwind-merge";

// Función `cn` que recibe múltiples clases y las combina en una sola cadena de clases
// - `clsx` permite concatenar clases condicionalmente (ej. solo si son truthy)
// - `twMerge` limpia la cadena final, eliminando duplicados y conflictos entre clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Función `toSlug` que convierte un título en un "slug" apto para URLs
export function toSlug(title: string) {
  return title
    .normalize("NFD") // Normaliza caracteres Unicode (e.g., á -> a + ´)
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos resultantes
    .toLowerCase() // Convierte todo a minúsculas
    .replace(/[^a-z0-9]+/g, "-") // Reemplaza cualquier carácter no alfanumérico por "-"
    .replace(/^-+|-+$/g, ""); // Elimina guiones iniciales o finales
}

// Función `fromSlugMatch` que compara un título con un slug
// Devuelve `true` si el slug generado del título coincide con el slug dado
export function fromSlugMatch(title: string, slug: string) {
  return toSlug(title) === slug;
}
