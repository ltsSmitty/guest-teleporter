export type TeleportDestination = "water" | "balloon" | "atm";
const MONEY_THRESHOLD = 90;

export const getTeleportDestination = (g: Guest): TeleportDestination => {
  if (g.hasItem({ type: "balloon" })) return "water";
  if (g.cash < MONEY_THRESHOLD) return "atm";
  return "balloon";
};
