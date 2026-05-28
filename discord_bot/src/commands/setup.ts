import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from 'discord.js'
import { getOrCreateUser } from '../services/accountService'
import { seedDefaultPresets } from '../services/timerService'
import { GAME_PRESETS, TIMER_EMOJI } from '../types'

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('Start all built-in game event timers at once')

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const { user } = await getOrCreateUser(interaction.user.id)

  await seedDefaultPresets(user.discordId, user.activeAccount)

  const enabled = Object.values(GAME_PRESETS).filter((p) => p.enabled)
  const list = enabled.map((p) => `${TIMER_EMOJI[p.type]} ${p.name}`).join('\n')

  const embed = new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle('✅ All Event Timers Started')
    .setDescription(
      `The following recurring timers have been added to **${user.activeAccount}**:\n\n${list}`,
    )
    .addFields({
      name: 'What happens next',
      value: "You'll get a DM 30 minutes before each event resets.\nUse `/timer list` to see all active timers.",
    })
    .setFooter({ text: 'Run /setup again on a new account to add them there too.' })

  await interaction.editReply({ embeds: [embed] })
}
