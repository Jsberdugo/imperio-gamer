import { TIERS } from "../data/tiers";

export function getTier(spent: number) {
  return [...TIERS].reverse().find((tier) => spent >= tier.min) ?? TIERS[0];
}
