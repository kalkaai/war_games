import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  MessageFlags,
} from 'discord.js'

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show all WarGuard commands')

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral })

  const embed = new EmbedBuilder()
    .setColor(Colors.Blurple)
    .setTitle('WarGuard — Commands')
    .addFields(
      {
        name: '⏱️ Timers',
        value: [
          '`/setup` — Start all built-in event timers at once',
          '`/timer preset` — Start a single recurring event timer',
          '`/timer list` — View your active timers',
          '`/timer delete` — Remove a timer by label',
          '`/timer clear` — Remove all expired timers',
          '`/timer add` — Add a custom timer *(Pro only)*',
        ].join('\n'),
      },
      {
        name: '🔔 Alerts',
        value: '`/alerts` — Set how early you want DM alerts (e.g. 30 min, 10 min before)',
      },
      {
        name: '👤 Accounts',
        value: [
          '`/account list` — View your account profiles',
          '`/account add` — Create a new profile *(Pro only)*',
          '`/account switch` — Switch active profile *(Pro only)*',
        ].join('\n'),
      },
      {
        name: '⭐ Pro',
        value: '`/upgrade` — Unlock custom timers, multiple accounts & custom alert thresholds',
      },
    )
    .setFooter({ text: 'You\'ll get DMs before timers expire — make sure DMs from server members are enabled.' })

  await interaction.editReply({ embeds: [embed] })
}
