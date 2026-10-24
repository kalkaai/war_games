import { Client, EmbedBuilder, Colors, TextChannel } from 'discord.js'
import { guildAlertsCol, guildAlertRef, Timestamp } from '../firebase'
import { GuildAlertConfigDoc, SupportedGameId } from '../types'
import {
  buildWatermarkedCardUrl,
  buildGameHubHandoffRow,
  GAMIDES_BASE_URL,
} from '../utils/viralLinks'

const VS_DAY_NAMES: Record<number, { name: string; focus: string }> = {
  1: { name: 'Day 1: Vehicle / Radar Day', focus: 'Use Golden Wrenches, Blueprints & Radar Stamina' },
  2: { name: 'Day 2: Base Expansion (Building)', focus: 'Pop Construction Speed-ups & Finish HQ/Labs' },
  3: { name: 'Day 3: Age of Science (Research)', focus: 'Spend Courage Badges & Research Speed-ups' },
  4: { name: 'Day 4: Hero Initiative (Heroes)', focus: 'Use Universal Gold Fragments, Recruitment & Skill Medals' },
  5: { name: 'Day 5: Total Mobilization (Troops)', focus: 'Train/Promote Highest Tier Troops & Speed-ups' },
  6: { name: 'Day 6: Enemy Buster (Kill Event)', focus: 'Activate Peace Shields or Attack Rival Server Targets' },
  0: { name: 'Sunday: Settlement & Prep', focus: 'Hoard Stamina & Speed-ups for Monday Reset' },
}

export async function setGuildAlertConfig(input: {
  guildId: string
  channelId: string
  utcOffsetHours: number
  game: SupportedGameId
}): Promise<GuildAlertConfigDoc> {
  const doc: GuildAlertConfigDoc = {
    guildId: input.guildId,
    channelId: input.channelId,
    utcOffsetHours: input.utcOffsetHours,
    game: input.game,
    enabled: true,
    sentWindowKeys: [],
    updatedAt: Timestamp.now(),
  }
  await guildAlertRef(input.guildId).set(doc)
  return doc
}

export async function getGuildAlertConfig(
  guildId: string,
): Promise<GuildAlertConfigDoc | null> {
  const snap = await guildAlertRef(guildId).get()
  if (!snap.exists) return null
  return snap.data() as GuildAlertConfigDoc
}

export async function disableGuildAlertConfig(guildId: string): Promise<boolean> {
  const snap = await guildAlertRef(guildId).get()
  if (!snap.exists) return false
  await guildAlertRef(guildId).update({
    enabled: false,
    updatedAt: Timestamp.now(),
  })
  return true
}

export function formatUtcOffset(hours: number): string {
  const sign = hours >= 0 ? '+' : '-'
  return `UTC${sign}${String(Math.abs(hours)).padStart(2, '0')}:00`
}

export function formatLocalTime(utcHour: number, utcMinute: number, offsetHours: number): string {
  const totalMins = ((utcHour * 60 + utcMinute + offsetHours * 60) % 1440 + 1440) % 1440
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} (${formatUtcOffset(offsetHours)})`
}

export function buildAllianceAlertPayload(
  config: GuildAlertConfigDoc,
  eventTitle: string,
  eventSubtitle: string,
  resetUtcHour: number,
  resetUtcMin: number,
) {
  const localTimeStr = formatLocalTime(resetUtcHour, resetUtcMin, config.utcOffsetHours)
  const now = new Date()
  const vsDay = VS_DAY_NAMES[now.getUTCDay()] ?? VS_DAY_NAMES[1]

  const gameLabel =
    config.game === 'whiteout-survival'
      ? 'Whiteout Survival'
      : config.game === 'last-war'
      ? 'Last War: Survival Game'
      : 'Last Z: Survival Shooter'

  const cardType =
    config.game === 'whiteout-survival'
      ? 'wos'
      : config.game === 'last-war'
      ? 'lastwar'
      : 'alert'

  const cardUrl = buildWatermarkedCardUrl({
    type: cardType,
    title: eventTitle,
    subtitle: `${gameLabel} • Alliance Broadcast`,
    stat1Label: 'Server Local Time',
    stat1Val: localTimeStr,
    stat2Label: 'Active VS Rotation',
    stat2Val: vsDay.name.replace(/^Day \d+:\s*/, ''),
    stat3Label: 'Recommended Action',
    stat3Val: 'Claim & Prep Now',
    note: vsDay.focus,
  })

  const embed = new EmbedBuilder()
    .setColor(Colors.Gold)
    .setTitle(`📣 ${eventTitle} — 30 Minute Warning`)
    .setURL(GAMIDES_BASE_URL)
    .setDescription(
      `**${eventSubtitle}**\n\n` +
        `🕒 **Server Local Reset:** \`${localTimeStr}\`\n` +
        `📅 **Current VS Focus:** **${vsDay.name}** — ${vsDay.focus}`,
    )
    .setImage(cardUrl)
    .setFooter({ text: `gamides.com • Automated ${gameLabel} Alliance Alert` })
    .setTimestamp()

  const row = buildGameHubHandoffRow(config.game)
  return { embeds: [embed], components: [row] }
}

/**
 * Checks all enabled guild alert configurations once per minute.
 * Triggers 30 minutes before:
 * - Daily Server / VS Reset (02:00 UTC -> alert at 01:30 UTC)
 * - Radar Reset windows (02:00, 10:00, 18:00 UTC -> alert at 01:30, 09:30, 17:30 UTC)
 * - Apocalypse Time / Arms Race 4h windows (02:00, 06:00, 10:00, 14:00, 18:00, 22:00 UTC)
 */
export async function runAllianceChannelAlertCheck(client: Client): Promise<void> {
  const snap = await guildAlertsCol.where('enabled', '==', true).get()
  if (snap.empty) return

  const now = new Date()
  const utcH = now.getUTCHours()
  const utcM = now.getUTCMinutes()
  const dateKey = now.toISOString().slice(0, 10)

  // Check if current minute is 30 minutes before a 4-hour cycle (01:30, 05:30, 09:30, 13:30, 17:30, 21:30 UTC)
  const is30MinBeforeCycle = utcM === 30 && [1, 5, 9, 13, 17, 21].includes(utcH)
  if (!is30MinBeforeCycle) return

  const targetHour = (utcH + 1) % 24
  const windowKey = `${dateKey}-${String(targetHour).padStart(2, '0')}:00`

  const isDailyReset = targetHour === 2
  const isRadarReset = [2, 10, 18].includes(targetHour)

  const eventTitle = isDailyReset
    ? 'Daily VS Duel & Server Reset'
    : isRadarReset
    ? 'Radar Station & Full Preparedness Reset'
    : 'Apocalypse Time / 4h Sub-Event Rotation'

  const eventSubtitle = isDailyReset
    ? 'New Alliance Duel VS Day, Daily Quests, and Radar missions reset in 30 minutes!'
    : isRadarReset
    ? 'Radar missions and 4-hour Preparedness cycle rotate in 30 minutes — prevent stamina overflow!'
    : 'Next 4-hour Preparedness / Arms Race chest window begins in 30 minutes!'

  await Promise.allSettled(
    snap.docs.map(async (docSnap: any) => {
      const config = docSnap.data() as GuildAlertConfigDoc
      const sent = config.sentWindowKeys ?? []
      if (sent.includes(windowKey)) return

      try {
        const ch = await client.channels.fetch(config.channelId)
        if (!ch || !(ch instanceof TextChannel)) return

        const payload = buildAllianceAlertPayload(
          config,
          eventTitle,
          eventSubtitle,
          targetHour,
          0,
        )
        await ch.send(payload)

        const trimmedKeys = [...sent.slice(-15), windowKey]
        await guildAlertRef(config.guildId).update({
          sentWindowKeys: trimmedKeys,
          updatedAt: Timestamp.now(),
        })
      } catch (err) {
        console.warn(`[AllianceAlerts] Failed to broadcast to guild ${config.guildId}:`, err)
      }
    }),
  )
}
