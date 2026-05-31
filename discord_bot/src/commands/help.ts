import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  MessageFlags,
} from 'discord.js'
import { PRO_ENABLED } from '../types'

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show all GAMIDES commands')

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral })

  const embed = new EmbedBuilder()
    .setColor(Colors.Blurple)
    .setTitle('GAMIDES — Commands')
    .addFields(
      {
        name: '⏱️ Timers',
        value: [
          '`/setup` — Start all built-in event timers at once',
          '`/timer list` — View your active timers',
          '`/timer delete` — Remove a timer by label',
          '`/timer clear` — Remove all expired timers',
          ...(PRO_ENABLED ? ['`/timer add` — Add a custom timer *(Pro only)*'] : []),
        ].join('\n'),
      },
      {
        name: '🔔 Alerts',
        value: '`/alerts test` — Send a test DM to confirm alert delivery\n`/alerts status` — Show your current alert settings',
      },
      {
        name: '👤 Accounts',
        value: [
          '`/account list` — View your account profiles',
          '`/account add` — Create a new profile',
          '`/account switch` — Switch active profile',
        ].join('\n'),
      },
      ...(PRO_ENABLED ? [{
        name: '⭐ Pro',
        value: '`/upgrade` — Unlock custom timers, multiple accounts & custom alert thresholds',
      }] : []),
    )
    .setFooter({ text: 'You\'ll get DMs before timers expire — make sure DMs from server members are enabled.' })

  await interaction.editReply({ embeds: [embed] })
}
