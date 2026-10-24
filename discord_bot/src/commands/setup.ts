import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  MessageFlags,
} from 'discord.js'
import { getOrCreateUser } from '../services/accountService'
import { seedDefaultPresets } from '../services/timerService'
import { GAME_PRESETS, TIMER_EMOJI } from '../types'
import { buildWatermarkedCardUrl, buildGameHubHandoffRow } from '../utils/viralLinks'

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('Start all built-in game event timers at once')

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral })

  const { user } = await getOrCreateUser(interaction.user.id)

  const { added, skipped } = await seedDefaultPresets(user.discordId, user.activeAccount)

  if (added.length === 0) {
    await interaction.editReply(
      `All event timers are already set up. Use \`/timer list\` to see them.`,
    )
    return
  }

  const addedList = added.map((name) => {
    const preset = Object.values(GAME_PRESETS).find((p) => p.name === name)!
    return `${TIMER_EMOJI[preset.type]} ${name}`
  }).join('\n')

  const cardUrl = buildWatermarkedCardUrl({
    type: 'schedule',
    title: 'Active Event Timers Synced',
    subtitle: 'Last Z: Survival Shooter • GAMIDES.COM',
    stat1Label: 'Recurring Presets',
    stat1Val: `${added.length} Active`,
    stat2Label: 'Alert Window',
    stat2Val: '30m Warning',
    stat3Label: 'Server Reset',
    stat3Val: '02:00 UTC',
    note: 'Full VS Rotation, HQ Tables & Seasonal Guides at www.gamides.com',
  })

  const embed = new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle('✅ Event Timers Started')
    .setDescription(`The following recurring timers have been added:\n\n${addedList}`)
    .addFields({
      name: 'What happens next',
      value: "You'll get a DM 30 minutes before each event resets.\nUse `/timer list` to see all active timers.",
    })
    .setImage(cardUrl)

  if (skipped.length > 0) {
    embed.setFooter({ text: `${skipped.length} already tracked and skipped • gamides.com` })
  } else {
    embed.setFooter({ text: 'gamides.com • Free Strategy Companion' })
  }

  const row = buildGameHubHandoffRow('last-z')
  await interaction.editReply({ embeds: [embed], components: [row] })
}
