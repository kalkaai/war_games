import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  MessageFlags,
} from 'discord.js'
import { getOrCreateUser, updateAlertThresholds } from '../services/accountService'
import { FREE_TIER } from '../types'

export const data = new SlashCommandBuilder()
  .setName('alerts')
  .setDescription('Configure your timer alert settings')
  .addSubcommand((sub) =>
    sub
      .setName('set')
      .setDescription('Set when to alert you before a timer expires (Pro only: multiple thresholds)')
      .addStringOption((opt) =>
        opt
          .setName('minutes')
          .setDescription('Minutes before expiry, e.g. "30" or "60,30,10" (Pro)')
          .setRequired(true),
      ),
  )
  .addSubcommand((sub) =>
    sub.setName('test').setDescription('Send a test DM to confirm alert delivery is working'),
  )
  .addSubcommand((sub) =>
    sub.setName('status').setDescription('Show your current alert settings'),
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral })

  const { user } = await getOrCreateUser(interaction.user.id)
  const sub = interaction.options.getSubcommand()

  if (sub === 'set') {
    const input = interaction.options.getString('minutes', true)
    const parsed = input
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n > 0 && n <= 1440)

    if (parsed.length === 0) {
      await interaction.editReply('Invalid input. Use a number like `30` or comma-separated values like `60,30,10`.')
      return
    }

    if (!user.isPro && parsed.length > 1) {
      await interaction.editReply(
        `Free tier supports **one alert threshold** (currently ${FREE_TIER.ALERT_THRESHOLDS[0]} min).\nUpgrade with \`/upgrade\` to set multiple thresholds.`,
      )
      return
    }

    if (!user.isPro && parsed[0] !== FREE_TIER.ALERT_THRESHOLDS[0]) {
      await interaction.editReply(
        `Free tier is fixed at **${FREE_TIER.ALERT_THRESHOLDS[0]}-minute alerts**.\nUse \`/upgrade\` to customize alert times.`,
      )
      return
    }

    const sorted = [...new Set(parsed)].sort((a, b) => b - a)
    await updateAlertThresholds(interaction.user.id, sorted)
    await interaction.editReply(
      `Alert thresholds updated: **${sorted.map((t) => `${t}min`).join(', ')}** before expiry.`,
    )
    return
  }

  if (sub === 'test') {
    try {
      const dmChannel = await interaction.user.createDM()
      await dmChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('✅ WarGuard Alert Test')
            .setDescription(
              'Alert delivery is working! You\'ll receive DMs like this when your timers are about to expire.',
            )
            .addFields({
              name: 'Current thresholds',
              value: user.alertThresholds.map((t) => `${t} min before expiry`).join('\n'),
            }),
        ],
      })
      await interaction.editReply('Test DM sent! Check your Direct Messages.')
    } catch {
      await interaction.editReply(
        "Couldn't send you a DM. Make sure you allow DMs from server members in your Discord privacy settings.",
      )
    }
    return
  }

  if (sub === 'status') {
    const embed = new EmbedBuilder()
      .setColor(Colors.Blurple)
      .setTitle('Alert Settings')
      .addFields(
        {
          name: 'Thresholds',
          value: user.alertThresholds.map((t) => `${t} min before expiry`).join('\n'),
        },
        {
          name: 'Plan',
          value: user.isPro ? 'Pro — custom thresholds enabled' : 'Free — 30 min only',
        },
      )
    await interaction.editReply({ embeds: [embed] })
  }
}
