import { LucideIcon } from "lucide-react";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  maxUnits: number;
  tag: string | null;
  icon: LucideIcon;
  color: string;
}
