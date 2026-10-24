import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
  MessageFlags,
} from 'discord.js'
import {
  setGuildAlertConfig,
  getGuildAlertConfig,
  disableGuildAlertConfig,
  formatUtcOffset,
  buildAllianceAlertPayload,
} from '../services/allianceAlertService'
import { SupportedGameId } from '../types'

export const data = new SlashCommandBuilder()
  .setName('alliance-alerts')
  .setDescription('Configure automated alliance channel alerts for VS Days, Radar, and Apocalypse Time')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand((sub) =>
    sub
      .setName('set')
      .setDescription('Bind a channel for automated server-timezone event broadcasts')
      .addChannelOption((opt) =>
        opt
          .setName('channel')
          .setDescription('Alliance announcements or war-room text channel')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true),
      )
      .addIntegerOption((opt) =>
        opt
          .setName('utc_offset')
          .setDescription('Your alliance primary timezone offset from UTC (e.g. -5 for EST, 0 for UTC, +8 for SGT)')
          .setMinValue(-12)
          .setMaxValue(14)
          .setRequired(true),
      )
      .addStringOption((opt) =>
        opt
          .setName('game')
          .setDescription('Game preset cadence (Last Z, Whiteout Survival, or Last War)')
          .addChoices(
            { name: 'Last Z: Survival Shooter', value: 'last-z' },
            { name: 'Whiteout Survival', value: 'whiteout-survival' },
            { name: 'Last War: Survival Game', value: 'last-war' },
          ),
      ),
  )
  .addSubcommand((sub) =>
    sub
      .setName('test')
      .setDescription('Send a preview watermarked alert card to your configured alliance channel'),
  )
  .addSubcommand((sub) =>
    sub
      .setName('status')
      .setDescription('View your server alliance alert configuration'),
  )
  .addSubcommand((sub) =>
    sub
      .setName('disable')
      .setDescription('Pause automated alliance channel broadcasts'),
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral })

  if (!interaction.guildId) {
    await interaction.editReply('This command can only be used inside a Discord server.')
    return
  }

  const sub = interaction.options.getSubcommand()

  if (sub === 'set') {
    const channel = interaction.options.getChannel('channel', true)
    const utcOffsetHours = interaction.options.getInteger('utc_offset', true)
    const game = (interaction.options.getString('game') ?? 'last-z') as SupportedGameId

    const config = await setGuildAlertConfig({
      guildId: interaction.guildId,
      channelId: channel.id,
      utcOffsetHours,
      game,
    })

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle('✅ Automated Alliance Alerts Activated')
      .setDescription(
        `GAMIDES will now post watermarked event schedules & 30-minute warnings to <#${config.channelId}>.`,
      )
      .addFields(
        { name: 'Channel', value: `<#${config.channelId}>`, inline: true },
        { name: 'Alliance Timezone', value: formatUtcOffset(config.utcOffsetHours), inline: true },
        { name: 'Game Profile', value: config.game, inline: true },
      )
      .setFooter({ text: 'Use /alliance-alerts test to preview a broadcast right now.' })

    await interaction.editReply({ embeds: [embed] })
    return
  }

  if (sub === 'test') {
    const config = await getGuildAlertConfig(interaction.guildId)
    if (!config || !config.enabled) {
      await interaction.editReply(
        'No active alliance alert channel configured. Run `/alliance-alerts set` first.',
      )
      return
    }

    const payload = buildAllianceAlertPayload(
      config,
      'Daily VS Duel & Radar Reset',
      'Preview of automated alliance broadcast with server timezone conversion.',
      2,
      0,
    )

    try {
      const ch = await interaction.client.channels.fetch(config.channelId)
      if (ch && ch.isTextBased() && 'send' in ch) {
        await ch.send(payload)
        await interaction.editReply(
          `Test alliance broadcast sent to <#${config.channelId}>!`,
        )
        return
      }
      await interaction.editReply('Configured channel could not be reached.')
    } catch {
      await interaction.editReply(
        `Failed to post in <#${config.channelId}>. Please verify the bot has **Send Messages** and **Embed Links** permissions.`,
      )
    }
    return
  }

  if (sub === 'status') {
    const config = await getGuildAlertConfig(interaction.guildId)
    if (!config) {
      await interaction.editReply(
        'Alliance alerts are not configured for this server yet. Run `/alliance-alerts set` to enable them.',
      )
      return
    }

    const embed = new EmbedBuilder()
      .setColor(config.enabled ? Colors.Blurple : Colors.Grey)
      .setTitle('📡 Alliance Alert Status')
      .addFields(
        { name: 'Status', value: config.enabled ? '🟢 Active' : '⏸️ Disabled', inline: true },
        { name: 'Channel', value: `<#${config.channelId}>`, inline: true },
        { name: 'Timezone', value: formatUtcOffset(config.utcOffsetHours), inline: true },
        { name: 'Game Cadence', value: config.game, inline: true },
      )

    await interaction.editReply({ embeds: [embed] })
    return
  }

  if (sub === 'disable') {
    const ok = await disableGuildAlertConfig(interaction.guildId)
    await interaction.editReply(
      ok
        ? '⏸️ Automated alliance channel alerts have been disabled.'
        : 'Alliance alerts were not configured for this server.',
    )
  }
}
