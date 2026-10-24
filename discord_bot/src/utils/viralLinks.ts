import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { SupportedGameId } from '../types'

export const GAMIDES_BASE_URL =
  process.env.GAMIDES_WEB_URL ?? 'https://www.gamides.com'

export interface WatermarkedCardOptions {
  type?: 'schedule' | 'alert' | 'wos' | 'lastwar' | 'calc'
  title: string
  subtitle?: string
  stat1Label: string
  stat1Val: string
  stat2Label: string
  stat2Val: string
  stat3Label: string
  stat3Val: string
  note?: string
}

export function buildWatermarkedCardUrl(opts: WatermarkedCardOptions): string {
  const params = new URLSearchParams({
    type: opts.type ?? 'calc',
    title: opts.title,
    subtitle: opts.subtitle ?? 'Last Z: Survival Shooter • GAMIDES.COM',
    s1l: opts.stat1Label,
    s1v: opts.stat1Val,
    s2l: opts.stat2Label,
    s2v: opts.stat2Val,
    s3l: opts.stat3Label,
    s3v: opts.stat3Val,
    ...(opts.note ? { note: opts.note } : {}),
  })
  return `${GAMIDES_BASE_URL}/api/card?${params.toString()}`
}

export function buildCalcHandoffRow(params: {
  from?: number
  to?: number
  hours?: number
  minutes?: number
  badges?: number
  secondaryLabel?: string
  secondaryPath?: string
}): ActionRowBuilder<ButtonBuilder> {
  const query = new URLSearchParams()
  if (params.from !== undefined) query.set('from', String(params.from))
  if (params.to !== undefined) query.set('to', String(params.to))
  if (params.hours !== undefined) query.set('hours', String(params.hours))
  if (params.minutes !== undefined) query.set('minutes', String(params.minutes))
  if (params.badges !== undefined) query.set('badges', String(params.badges))

  const calcUrl = `${GAMIDES_BASE_URL}/calc${query.toString() ? `?${query.toString()}` : ''}`

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel('Open Pre-Filled Calculator (gamides.com)')
      .setStyle(ButtonStyle.Link)
      .setURL(calcUrl),
  )

  if (params.secondaryLabel && params.secondaryPath) {
    row.addComponents(
      new ButtonBuilder()
        .setLabel(params.secondaryLabel)
        .setStyle(ButtonStyle.Link)
        .setURL(`${GAMIDES_BASE_URL}${params.secondaryPath}`),
    )
  }

  return row
}

export function buildGameHubHandoffRow(
  game: SupportedGameId = 'last-z',
): ActionRowBuilder<ButtonBuilder> {
  const hubPath =
    game === 'whiteout-survival'
      ? '/whiteout-survival'
      : game === 'last-war'
      ? '/last-war'
      : '/events'

  const calcPath =
    game === 'whiteout-survival'
      ? '/whiteout-survival#furnace-calc'
      : game === 'last-war'
      ? '/last-war#hq-calc'
      : '/calc'

  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel('Live Event Schedule (gamides.com)')
      .setStyle(ButtonStyle.Link)
      .setURL(`${GAMIDES_BASE_URL}${hubPath}`),
    new ButtonBuilder()
      .setLabel('Interactive Upgrade Calculators')
      .setStyle(ButtonStyle.Link)
      .setURL(`${GAMIDES_BASE_URL}${calcPath}`),
  )
}
