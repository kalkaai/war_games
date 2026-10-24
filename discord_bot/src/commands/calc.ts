import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from 'discord.js'
import {
  buildWatermarkedCardUrl,
  buildCalcHandoffRow,
  GAMIDES_BASE_URL,
} from '../utils/viralLinks'

interface HQRow {
  level: number
  wood: number
  food: number
  zent: number
  steel: number
  mins: number
  reqs: string[]
}

const HQ_TABLE: HQRow[] = [
  { level: 1, wood: 12000, food: 0, zent: 0, steel: 0, mins: 0, reqs: [] },
  { level: 2, wood: 0, food: 10300, zent: 0, steel: 0, mins: 0, reqs: [] },
  { level: 3, wood: 0, food: 15500, zent: 0, steel: 0, mins: 0, reqs: [] },
  { level: 4, wood: 0, food: 23300, zent: 0, steel: 0, mins: 2, reqs: ['City Wall'] },
  { level: 5, wood: 0, food: 46600, zent: 0, steel: 0, mins: 13, reqs: ['Radar', 'Assaulter Camp'] },
  { level: 6, wood: 139900, food: 139900, zent: 27400, steel: 0, mins: 20, reqs: ['Military Center'] },
  { level: 7, wood: 279900, food: 279900, zent: 54800, steel: 0, mins: 41, reqs: ['Alliance Center', 'Training Ground'] },
  { level: 8, wood: 447900, food: 447900, zent: 87800, steel: 0, mins: 76, reqs: ['Laboratory', 'Assaulter Camp'] },
  { level: 9, wood: 716600, food: 716600, zent: 140000, steel: 0, mins: 110, reqs: ['Laboratory', 'Hospital'] },
  { level: 10, wood: 859900, food: 859900, zent: 168000, steel: 0, mins: 165, reqs: ['Laboratory', 'Shooter Camp'] },
  { level: 11, wood: 2100000, food: 2100000, zent: 421000, steel: 0, mins: 233, reqs: ['Laboratory', 'Rider Camp'] },
  { level: 12, wood: 3600000, food: 3600000, zent: 716000, steel: 0, mins: 301, reqs: ['Laboratory', 'City Walls'] },
  { level: 13, wood: 4000000, food: 4000000, zent: 788000, steel: 0, mins: 482, reqs: ['Laboratory', 'Alliance Center'] },
  { level: 14, wood: 5600000, food: 5600000, zent: 1100000, steel: 0, mins: 771, reqs: ['Laboratory', 'Assaulter Camp'] },
  { level: 15, wood: 7800000, food: 7800000, zent: 1500000, steel: 0, mins: 1097, reqs: ['Laboratory', 'Shooter Camp'] },
  { level: 16, wood: 14000000, food: 14000000, zent: 2700000, steel: 0, mins: 1645, reqs: ['Laboratory', 'Rider Camp'] },
  { level: 17, wood: 18200000, food: 18200000, zent: 3500000, steel: 0, mins: 2377, reqs: ['Laboratory', 'City Walls'] },
  { level: 18, wood: 31900000, food: 31900000, zent: 6200000, steel: 0, mins: 2880, reqs: ['Laboratory', 'Alliance Center'] },
  { level: 19, wood: 38200000, food: 38200000, zent: 7500000, steel: 0, mins: 4795, reqs: ['Laboratory', 'Assaulter Camp'] },
  { level: 20, wood: 68900000, food: 68900000, zent: 13500000, steel: 0, mins: 7795, reqs: ['Laboratory', 'Shooter Camp'] },
  { level: 21, wood: 96400000, food: 96400000, zent: 18900000, steel: 0, mins: 4403, reqs: ['Laboratory', 'Rider Camp'] },
  { level: 22, wood: 125400000, food: 125400000, zent: 24600000, steel: 0, mins: 17280, reqs: ['Laboratory', 'City Walls'] },
  { level: 23, wood: 156800000, food: 156800000, zent: 30700000, steel: 0, mins: 25920, reqs: ['Laboratory', 'Alliance Center'] },
  { level: 24, wood: 196000000, food: 196000000, zent: 38400000, steel: 0, mins: 36224, reqs: ['Laboratory', 'Assaulter Camp'] },
  { level: 25, wood: 333200000, food: 333200000, zent: 65300000, steel: 0, mins: 50617, reqs: ['Laboratory', 'Shooter Camp'] },
  { level: 26, wood: 466500000, food: 466500000, zent: 91400000, steel: 0, mins: 70768, reqs: ['Laboratory', 'Rider Camp'] },
  { level: 27, wood: 606400000, food: 606400000, zent: 119000000, steel: 0, mins: 91927, reqs: ['Laboratory', 'City Walls'] },
  { level: 28, wood: 806500000, food: 806500000, zent: 157700000, steel: 0, mins: 119433, reqs: ['Laboratory', 'Alliance Center'] },
  { level: 29, wood: 1100000000, food: 1100000000, zent: 221300000, steel: 0, mins: 155191, reqs: ['Laboratory', 'Assaulter Camp'] },
  { level: 30, wood: 1400000000, food: 1400000000, zent: 277100000, steel: 0, mins: 201676, reqs: ['Laboratory', 'Shooter Camp'] },
  { level: 31, wood: 1200000000, food: 1200000000, zent: 241400000, steel: 2200000, mins: 197218, reqs: ['Laboratory', 'Rider Camp'] },
  { level: 32, wood: 1400000000, food: 1400000000, zent: 289800000, steel: 3100000, mins: 236661, reqs: ['Laboratory', 'City Walls'] },
  { level: 33, wood: 1700000000, food: 1700000000, zent: 347600000, steel: 4100000, mins: 283994, reqs: ['Laboratory', 'Alliance Center'] },
  { level: 34, wood: 2000000000, food: 2000000000, zent: 399500000, steel: 5300000, mins: 326593, reqs: ['Laboratory', 'Assaulter Camp'] },
  { level: 35, wood: 2300000000, food: 2300000000, zent: 459800000, steel: 6400000, mins: 375582, reqs: ['Laboratory', 'Shooter Camp'] },
]

const STAR_CUMULATIVE = [
  { star: 0, frags: 0, medals: 0, vsPts: 0 },
  { star: 1, frags: 25, medals: 3000, vsPts: 375000 },
  { star: 2, frags: 75, medals: 11000, vsPts: 1125000 },
  { star: 3, frags: 225, medals: 33000, vsPts: 3375000 },
  { star: 4, frags: 525, medals: 78000, vsPts: 7875000 },
  { star: 5, frags: 975, medals: 163000, vsPts: 14625000 },
]

function fmt(n: number): string {
  if (n === 0) return '0'
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}G`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return n.toLocaleString()
}

export const data = new SlashCommandBuilder()
  .setName('calc')
  .setDescription('Generate shareable GAMIDES calculator summaries with web deep-links')
  .addSubcommand((sub) =>
    sub
      .setName('hq')
      .setDescription('Calculate total HQ upgrade resources and speed-ups between two levels')
      .addIntegerOption((opt) =>
        opt
          .setName('from')
          .setDescription('Current HQ level (1-34)')
          .setMinValue(1)
          .setMaxValue(34)
          .setRequired(true),
      )
      .addIntegerOption((opt) =>
        opt
          .setName('to')
          .setDescription('Target HQ level (2-35)')
          .setMinValue(2)
          .setMaxValue(35)
          .setRequired(true),
      ),
  )
  .addSubcommand((sub) =>
    sub
      .setName('speedup')
      .setDescription('Calculate 1h, 3h, 8h, and 24h speed-ups needed for a timer')
      .addIntegerOption((opt) =>
        opt.setName('hours').setDescription('Hours').setMinValue(0).setRequired(true),
      )
      .addIntegerOption((opt) =>
        opt.setName('minutes').setDescription('Minutes').setMinValue(0).setMaxValue(59),
      ),
  )
  .addSubcommand((sub) =>
    sub
      .setName('pivot')
      .setDescription('Calculate Hero Fragments & Skill Medals needed for a seasonal meta pivot')
      .addIntegerOption((opt) =>
        opt
          .setName('current_stars')
          .setDescription('Current Star Level (0-4)')
          .setMinValue(0)
          .setMaxValue(4)
          .setRequired(true),
      )
      .addIntegerOption((opt) =>
        opt
          .setName('target_stars')
          .setDescription('Target Star Level (1-5)')
          .setMinValue(1)
          .setMaxValue(5)
          .setRequired(true),
      ),
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand()

  if (sub === 'hq') {
    const from = interaction.options.getInteger('from', true)
    const to = interaction.options.getInteger('to', true)

    if (to <= from) {
      await interaction.reply({
        content: 'Target HQ level (`to`) must be greater than `from`.',
        ephemeral: true,
      })
      return
    }

    const slice = HQ_TABLE.filter((r) => r.level > from && r.level <= to)
    const totals = slice.reduce(
      (acc, r) => ({
        wood: acc.wood + r.wood,
        food: acc.food + r.food,
        zent: acc.zent + r.zent,
        steel: acc.steel + r.steel,
        mins: acc.mins + r.mins,
      }),
      { wood: 0, food: 0, zent: 0, steel: 0, mins: 0 },
    )

    const totalHours = Math.ceil(totals.mins / 60)
    const totalDays = (totals.mins / 1440).toFixed(1)
    const targetRow = HQ_TABLE.find((r) => r.level === to)!

    const cardUrl = buildWatermarkedCardUrl({
      type: 'calc',
      title: `HQ ${from} → HQ ${to} Upgrade Plan`,
      subtitle: 'Last Z: Survival Shooter • GAMIDES.COM',
      stat1Label: 'Wood & Food Needed',
      stat1Val: `${fmt(totals.wood)} each`,
      stat2Label: totals.steel > 0 ? 'Zent & Steel' : 'Zent Required',
      stat2Val:
        totals.steel > 0
          ? `${fmt(totals.zent)} / ${fmt(totals.steel)}`
          : fmt(totals.zent),
      stat3Label: 'Base Build Time',
      stat3Val: `${totalDays}d (${totalHours.toLocaleString()}h)`,
      note: `Target HQ ${to} Gates: ${targetRow.reqs.join(' + ') || 'None'} Lv.${to - 1}`,
    })

    const embed = new EmbedBuilder()
      .setColor(Colors.Purple)
      .setTitle(`🏰 HQ ${from} → HQ ${to} Resource & Speed-Up Summary`)
      .setURL(`${GAMIDES_BASE_URL}/hq/level-${to}-requirements`)
      .setDescription(
        `Complete resource breakdown across **${slice.length} HQ level${slice.length > 1 ? 's' : ''}**.`,
      )
      .addFields(
        { name: '🪵 Wood', value: fmt(totals.wood), inline: true },
        { name: '🍖 Food', value: fmt(totals.food), inline: true },
        { name: '💰 Zent', value: fmt(totals.zent), inline: true },
        ...(totals.steel > 0
          ? [{ name: '⚙️ Steel', value: fmt(totals.steel), inline: true }]
          : []),
        {
          name: '⏱️ Speed-Ups Needed',
          value: `**${totalHours.toLocaleString()}×** 1h (${Math.ceil(totalHours / 24)}× 24h)`,
          inline: true,
        },
        {
          name: `🔓 HQ ${to} Prerequisite Buildings`,
          value:
            targetRow.reqs.map((b) => `${b} Lv.${to - 1}`).join(', ') || 'None',
          inline: false,
        },
      )
      .setImage(cardUrl)
      .setFooter({ text: 'gamides.com • Shareable Alliance Calculator Card' })

    const row = buildCalcHandoffRow({
      from,
      to,
      hours: totalHours,
      secondaryLabel: `HQ ${to} Full Guide (gamides.com)`,
      secondaryPath: `/hq/level-${to}-requirements`,
    })

    await interaction.reply({ embeds: [embed], components: [row] })
    return
  }

  if (sub === 'speedup') {
    const hours = interaction.options.getInteger('hours', true)
    const minutes = interaction.options.getInteger('minutes') ?? 0
    const totalMins = hours * 60 + minutes

    if (totalMins <= 0) {
      await interaction.reply({
        content: 'Please enter a duration greater than 0 minutes.',
        ephemeral: true,
      })
      return
    }

    const s1h = Math.ceil(totalMins / 60)
    const s3h = Math.ceil(totalMins / 180)
    const s8h = Math.ceil(totalMins / 480)
    const s24h = Math.ceil(totalMins / 1440)

    const cardUrl = buildWatermarkedCardUrl({
      type: 'calc',
      title: `Speed-Up Plan: ${hours}h ${minutes}m`,
      subtitle: 'Last Z: Survival Shooter • GAMIDES.COM',
      stat1Label: '1h / 3h Speed-Ups',
      stat1Val: `${s1h} / ${s3h}`,
      stat2Label: '8h Speed-Ups',
      stat2Val: `${s8h} items`,
      stat3Label: '24h Speed-Ups',
      stat3Val: `${s24h} items`,
      note: 'Tip: Pop Building Speed-ups on Tuesday & Research on Wednesday VS Day!',
    })

    const embed = new EmbedBuilder()
      .setColor(Colors.Purple)
      .setTitle(`⏱️ Speed-Up Calculator (${hours}h ${minutes}m)`)
      .setURL(`${GAMIDES_BASE_URL}/calc?hours=${hours}&minutes=${minutes}`)
      .addFields(
        { name: '1-Hour Items', value: `${s1h.toLocaleString()}`, inline: true },
        { name: '3-Hour Items', value: `${s3h.toLocaleString()}`, inline: true },
        { name: '8-Hour Items', value: `${s8h.toLocaleString()}`, inline: true },
        { name: '24-Hour Items', value: `${s24h.toLocaleString()}`, inline: true },
      )
      .setImage(cardUrl)
      .setFooter({ text: 'gamides.com • Shareable Alliance Calculator Card' })

    const row = buildCalcHandoffRow({ hours, minutes })
    await interaction.reply({ embeds: [embed], components: [row] })
    return
  }

  if (sub === 'pivot') {
    const curStars = interaction.options.getInteger('current_stars', true)
    const targetStars = interaction.options.getInteger('target_stars', true)

    if (targetStars <= curStars) {
      await interaction.reply({
        content: '`target_stars` must be higher than `current_stars`.',
        ephemeral: true,
      })
      return
    }

    const startObj = STAR_CUMULATIVE[curStars]
    const endObj = STAR_CUMULATIVE[targetStars]

    const frags = endObj.frags - startObj.frags
    const medals = endObj.medals - startObj.medals
    const vsPts = endObj.vsPts - startObj.vsPts

    const cardUrl = buildWatermarkedCardUrl({
      type: 'calc',
      title: `Hero Meta Pivot: ${curStars}★ → ${targetStars}★`,
      subtitle: 'Seasonal S+ Carry Planner • GAMIDES.COM',
      stat1Label: 'Gold Fragments',
      stat1Val: `${frags} Shards`,
      stat2Label: 'Skill Medals',
      stat2Val: fmt(medals),
      stat3Label: 'VS Heroes Day Score',
      stat3Val: `+${fmt(vsPts)} pts`,
      note: 'Compare all 30 Heroes & S1-S5 Meta Shifts at www.gamides.com/seasons',
    })

    const embed = new EmbedBuilder()
      .setColor(Colors.Gold)
      .setTitle(`🔄 Seasonal Hero Pivot (${curStars}★ → ${targetStars}★)`)
      .setURL(`${GAMIDES_BASE_URL}/seasons`)
      .addFields(
        { name: '🧩 Gold Fragments', value: `${frags}`, inline: true },
        { name: '🏅 Skill Medals', value: fmt(medals), inline: true },
        { name: '🎯 Thursday VS Score', value: `+${fmt(vsPts)} pts`, inline: true },
      )
      .setImage(cardUrl)
      .setFooter({ text: 'gamides.com • Seasonal Meta & Pivot Planner' })

    const row = buildCalcHandoffRow({
      secondaryLabel: 'Open Seasonal Pivot Hub (gamides.com)',
      secondaryPath: '/seasons',
    })

    await interaction.reply({ embeds: [embed], components: [row] })
  }
}
