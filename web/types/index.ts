// Subset of types from discord_bot/src/types/index.ts
// Adapted for web use: Firestore Timestamp replaced with plain number (Unix ms).
// Do NOT import from discord_bot/ — this is a standalone copy.

export type TimerType =
  | "construction"
  | "research"
  | "troops"
  | "healing"
  | "shield"
  | "prepare"
  | "radar"
  | "arena"
  | "daily_quests"
  | "merit_chest"
  | "lucky_attempts"
  | "vehicle"
  | "heroes"
  | "combat"
  | "canyon"
  | "tyrant";

export const TIMER_EMOJI: Record<TimerType, string> = {
  construction: "🏗️",
  research: "🔬",
  troops: "⚔️",
  healing: "💊",
  shield: "🛡️",
  prepare: "🎯",
  radar: "📡",
  arena: "🏟️",
  daily_quests: "📋",
  merit_chest: "🎁",
  lucky_attempts: "🎲",
  vehicle: "🔧",
  heroes: "🦸",
  combat: "💀",
  canyon: "🏔️",
  tyrant: "👑",
};

export interface GamePreset {
  name: string;
  choiceLabel: string;
  type: TimerType;
  intervalMs: number;
  recurringMode: "relative" | "fixed";
  description: string;
  enabled?: boolean;
  anchorHourUTC?: number;
  anchorMinuteUTC?: number;
  anchorDayUTC?: number;
}

// ── HQ data ──────────────────────────────────────────────────────────────────

export interface HQCost {
  wood: number;
  food: number;
  zent: number;
  steel: number;
}

export interface HQLevel {
  level: number;
  heroesCap: number;
  requiredBuildings: string[];
  cost: HQCost;
  buildTimeMinutes: number;
  cp: number;
}

// ── Research data ─────────────────────────────────────────────────────────────

export interface ResearchNode {
  id: string;
  name: string;
  maxLevel: number;
  totalBadges: number;
  stat?: string;
  statMin?: string;
  statMax?: string;
}

export interface ResearchTree {
  id: string;
  name: string;
  icon: string;
  nodeCount: number;
  totalBadges: number;
  unlockRequirement?: string;
  description: string;
  nodes: ResearchNode[];
}

// ── Hero data ─────────────────────────────────────────────────────────────────

export type HeroFaction = "blood_rose" | "wings_of_dawn" | "guard_of_order";
export type TroopType = "assaulter" | "shooter" | "rider";

export interface HeroSkill {
  name: string;
  type: "normal_attack" | "active" | "passive" | "exclusive";
  description?: string;
}

export interface Hero {
  id: string;
  name: string;
  faction: HeroFaction;
  troopType: TroopType;
  tier: string;
  role: string;
  season?: string | null;
  portrait?: string | null;
  skills: HeroSkill[];
  pvpRating: string;
  pveRating: string;
  priority: number;
  f2p: boolean;
}

// ── Gear data ─────────────────────────────────────────────────────────────────

export type GearSlot = "helmet" | "chest" | "gloves" | "boots" | "weapon" | "accessory";

export interface GearStat {
  stat: string;
  value: string;
}

export interface GearPiece {
  id: string;
  name: string;
  slot: GearSlot;
  setId: string;
  tier: string;
  stats: GearStat[];
  craftMaterials?: string | null;
}

export interface GearSet {
  id: string;
  name: string;
  focus: string;
  setBonuses: GearStat[];
  pieces: GearPiece[];
}

// ── Tank / Vehicle data ───────────────────────────────────────────────────────

export interface VehicleUpgrade {
  name: string;
  level?: number;
  effect: string;
}

export interface Vehicle {
  id: string;
  name: string;
  unlockLevel?: number;
  unlockWrenches: number;
  totalWrenches?: number;
  description: string;
  keyUpgrades: VehicleUpgrade[];
}
