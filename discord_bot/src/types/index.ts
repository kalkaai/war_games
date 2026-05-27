import { Timestamp } from '../db/memoryStore'

export type TimerType =
  | 'construction' | 'research' | 'troops' | 'healing' | 'shield'
  | 'prepare' | 'radar' | 'arena' | 'daily_quests' | 'merit_chest'
  | 'lucky_attempts' | 'vehicle' | 'heroes' | 'combat' | 'canyon' | 'tyrant'

export const TIMER_TYPES: TimerType[] = [
  'construction', 'research', 'troops', 'healing', 'shield',
  'prepare', 'radar', 'arena', 'daily_quests', 'merit_chest',
  'lucky_attempts', 'vehicle', 'heroes', 'combat', 'canyon', 'tyrant',
]

export const TIMER_EMOJI: Record<TimerType, string> = {
  construction: '🏗️',
  research: '🔬',
  troops: '⚔️',
  healing: '💊',
  shield: '🛡️',
  prepare: '🎯',
  radar: '📡',
  arena: '🏟️',
  daily_quests: '📋',
  merit_chest: '🎁',
  lucky_attempts: '🎲',
  vehicle: '🔧',
  heroes: '🦸',
  combat: '💀',
  canyon: '🏔️',
  tyrant: '👑',
}

export interface UserDoc {
  discordId: string
  activeAccount: string
  alertThresholds: number[]  // minutes before expiry, e.g. [60, 30, 10]
  isPro: boolean
  createdAt: Timestamp
}

export interface AccountDoc {
  name: string
  createdAt: Timestamp
}

export interface TimerDoc {
  id: string
  type: TimerType
  label: string
  expiresAt: Timestamp
  createdAt: Timestamp
  alertsSent: number[]  // threshold values (minutes) already DM'd for this timer
  recurring?: boolean
  intervalMs?: number       // reset interval in ms
  recurringMode?: 'relative' | 'fixed'
  // relative: next = now + intervalMs (rolling)
  // fixed:    next = prevExpiresAt + intervalMs (stays on schedule)
}

export interface GamePreset {
  name: string
  choiceLabel: string
  type: TimerType
  intervalMs: number
  recurringMode: 'relative' | 'fixed'
  description: string
  enabled?: boolean
  // For fixed-schedule events: anchor to server cycle (02:00 UTC = server reset)
  anchorHourUTC?: number    // hour of first occurrence in the cycle (0-23)
  anchorMinuteUTC?: number  // minute offset within the hour (0-59, defaults to 0)
  anchorDayUTC?: number     // day of week for weekly events (0=Sun, 1=Mon...)
}

import presetsData from '../data/gamePresets.json'
import configData from '../data/config.json'

export const GAME_PRESETS: Record<string, GamePreset> = presetsData.presets as Record<string, GamePreset>

export const FREE_TIER = {
  MAX_ACCOUNTS: configData.freeTier.maxAccounts,
  MAX_TIMERS: configData.freeTier.maxTimers,
  ALERT_THRESHOLDS: configData.freeTier.alertThresholds,
} as const
