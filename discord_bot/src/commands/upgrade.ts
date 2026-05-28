import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  MessageFlags,
} from 'discord.js'
import { getOrCreateUser } from '../services/accountService'
import { FREE_TIER } from '../types'
import configData from '../data/config.json'

export const data = new SlashCommandBuilder()
  .setName('upgrade')
  .setDescription('Upgrade to WarGuard Pro — unlimited accounts, timers, and custom alerts')

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral })

  const { user } = await getOrCreateUser(interaction.user.id)

  if (user.isPro) {
    await interaction.editReply('You\'re already on **WarGuard Pro**. Thanks for the support!')
    return
  }

  const paymentLink = process.env.STRIPE_PAYMENT_LINK

  if (!paymentLink) {
    await interaction.editReply('Upgrade link is not configured yet. Check back soon!')
    return
  }

  const { freeTier, proTier, upgrade } = configData
  const freeFeatures = [
    `${FREE_TIER.MAX_ACCOUNTS} account profile`,
    `${FREE_TIER.MAX_TIMERS} active timers`,
    `${FREE_TIER.ALERT_THRESHOLDS.filter((t) => t > 0).join(', ')}-min alerts only`,
  ].map((f) => `• ${f}`).join('\n')

  const embed = new EmbedBuilder()
    .setColor(Colors.Gold)
    .setTitle(upgrade.title)
    .setDescription(upgrade.tagline)
    .addFields(
      {
        name: 'Free',
        value: freeFeatures,
        inline: true,
      },
      {
        name: `Pro — ${proTier.price}`,
        value: proTier.features.map((f) => `• ${f}`).join('\n'),
        inline: true,
      },
    )
    .addFields({ name: 'Payment Link', value: paymentLink })
    .setFooter({ text: upgrade.footer })

  await interaction.editReply({ embeds: [embed] })
}
