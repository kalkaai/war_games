import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from 'discord.js'
import { getOrCreateUser } from '../services/accountService'
import { addTimer, listTimers, deleteTimer, clearExpiredTimers, nextPresetOccurrence, seedDefaultPresets } from '../services/timerService'
import { parseDuration } from '../utils/parseDuration'
import { formatTimeUntil, formatDuration } from '../utils/formatDuration'
import { TIMER_TYPES, TIMER_EMOJI, GAME_PRESETS } from '../types'
import { AutocompleteInteraction } from 'discord.js'


export async function autocomplete(interaction: AutocompleteInteraction): Promise<void> {
  const focused = interaction.options.getFocused().toLowerCase()
  const matches = Object.entries(GAME_PRESETS)
    .filter(([, preset]) => preset.enabled)
    .filter(([key, preset]) =>
      focused === '' || key.includes(focused) || preset.choiceLabel.toLowerCase().includes(focused),
    )
    .slice(0, 25)
    .map(([key, preset]) => ({ name: preset.choiceLabel, value: key }))
  await interaction.respond(matches)
}

export const data = new SlashCommandBuilder()
  .setName('timer')
  .setDescription('Manage your game timers')
  .addSubcommand((sub) =>
    sub
      .setName('add')
      .setDescription('Add a new timer')
      .addStringOption((opt) =>
        opt
          .setName('type')
          .setDescription('Type of timer')
          .setRequired(true)
          .addChoices(
            { name: '🏗️ Construction', value: 'construction' },
            { name: '🔬 Research', value: 'research' },
            { name: '⚔️ Troops', value: 'troops' },
            { name: '💊 Healing', value: 'healing' },
            { name: '🛡️ Shield', value: 'shield' },
          ),
      )
      .addStringOption((opt) =>
        opt
          .setName('duration')
          .setDescription('Time remaining, e.g. 4h30m, 2h, 45m')
          .setRequired(true),
      )
      .addStringOption((opt) =>
        opt.setName('label').setDescription('Optional label, e.g. "HQ upgrade"').setRequired(false),
      )
      .addBooleanOption((opt) =>
        opt
          .setName('repeat')
          .setDescription('Auto-reset after expiry? (makes it a recurring timer)')
          .setRequired(false),
      ),
  )
  .addSubcommand((sub) =>
    sub
      .setName('preset')
      .setDescription('Start a recurring timer for a known game event')
      .addStringOption((opt) =>
        opt
          .setName('event')
          .setDescription('Game event to track')
          .setRequired(true)
          .setAutocomplete(true),
      ),
  )
  .addSubcommand((sub) =>
    sub.setName('list').setDescription('Show all your active timers'),
  )
  .addSubcommand((sub) =>
    sub
      .setName('delete')
      .setDescription('Delete a timer by label')
      .addStringOption((opt) =>
        opt.setName('label').setDescription('Label of the timer to delete').setRequired(true),
      ),
  )
  .addSubcommand((sub) =>
    sub.setName('clear').setDescription('Remove all expired timers'),
  )
  .addSubcommand((sub) =>
    sub.setName('setup_all_presets').setDescription('Start all built-in game event timers at once'),
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const { user } = await getOrCreateUser(interaction.user.id)
  const sub = interaction.options.getSubcommand()

  if (sub === 'add') {
    const type = interaction.options.getString('type', true) as typeof TIMER_TYPES[number]
    const durationStr = interaction.options.getString('duration', true)
    const label = interaction.options.getString('label') ?? type
    const repeat = interaction.options.getBoolean('repeat') ?? false

    const durationMs = parseDuration(durationStr)
    if (!durationMs) {
      await interaction.editReply('Invalid duration. Use formats like `4h30m`, `2h`, `45m`.')
      return
    }

    if (!user.isPro) {
      await interaction.editReply(
        '⚙️ **Custom timers are a Pro feature.**\nFree accounts can use `/timer preset` for all built-in game events — unlimited and free.\n\nUse `/upgrade` to unlock custom timers.',
      )
      return
    }

    const expiresAt = new Date(Date.now() + durationMs)
    await addTimer(interaction.user.id, user.activeAccount, {
      type,
      label,
      expiresAt,
      ...(repeat && { recurring: true, intervalMs: durationMs, recurringMode: 'relative' }),
    })

    const emoji = TIMER_EMOJI[type]
    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${emoji} Timer Added${repeat ? ' 🔁' : ''}`)
      .addFields(
        { name: 'Label', value: label, inline: true },
        { name: 'Type', value: type, inline: true },
        { name: 'Expires', value: formatTimeUntil(expiresAt), inline: true },
        { name: 'Account', value: user.activeAccount, inline: true },
        ...(repeat ? [{ name: 'Repeats', value: `Every ${formatDuration(durationMs)}`, inline: true }] : []),
      )
      .setFooter({ text: repeat ? "Auto-repeats after expiry." : "You'll get a DM before it expires." })

    await interaction.editReply({ embeds: [embed] })
    return
  }

  if (sub === 'preset') {
    const eventKey = interaction.options.getString('event', true)
    const preset = GAME_PRESETS[eventKey]

    const expiresAt = nextPresetOccurrence(preset)
    await addTimer(interaction.user.id, user.activeAccount, {
      type: preset.type,
      label: preset.name,
      expiresAt,
      recurring: true,
      intervalMs: preset.intervalMs,
      recurringMode: preset.recurringMode,
    })

    const emoji = TIMER_EMOJI[preset.type]
    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${emoji} ${preset.name} 🔁`)
      .setDescription(
        `Recurring event started on **${user.activeAccount}**.\n` +
        `Next alert: ${formatTimeUntil(expiresAt)}\n` +
        `Schedule: ${preset.description}`,
      )
      .setFooter({ text: 'Auto-resets after each expiry. Use /timer delete to stop.' })

    await interaction.editReply({ embeds: [embed] })
    return
  }

  if (sub === 'list') {
    const timers = await listTimers(interaction.user.id, user.activeAccount)
    const live = timers
      .filter((t) => t.expiresAt.toDate() > new Date())
      .sort((a, b) => a.expiresAt.seconds - b.expiresAt.seconds)

    if (live.length === 0) {
      await interaction.editReply(
        `No active timers on **${user.activeAccount}**. Use \`/timer add\` to start tracking.`,
      )
      return
    }

    const embed = new EmbedBuilder()
      .setColor(Colors.Blurple)
      .setTitle(`Timers — ${user.activeAccount}`)
      .setDescription(
        live
          .map((t) => {
            const emoji = TIMER_EMOJI[t.type]
            const timeLeft = formatTimeUntil(t.expiresAt.toDate())
            const recurringTag = t.recurring ? ' 🔁' : ''
            return `${emoji} **${t.label}**${recurringTag} — ${timeLeft}`
          })
          .join('\n'),
      )
      .setFooter({ text: `${live.length} active timer${live.length !== 1 ? 's' : ''} • 🔁 = recurring` })

    await interaction.editReply({ embeds: [embed] })
    return
  }

  if (sub === 'delete') {
    const label = interaction.options.getString('label', true)
    const deleted = await deleteTimer(interaction.user.id, user.activeAccount, label)

    if (!deleted) {
      await interaction.editReply(`No timer found with label **${label}**.`)
      return
    }

    await interaction.editReply(`Deleted timer: **${label}**`)
    return
  }

  if (sub === 'clear') {
    const count = await clearExpiredTimers(interaction.user.id, user.activeAccount)
    await interaction.editReply(
      count > 0
        ? `Cleared ${count} expired timer${count !== 1 ? 's' : ''}.`
        : 'No expired timers to clear.',
    )
    return
  }

  if (sub === 'setup_all_presets') {
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
      .setFooter({ text: 'Switch accounts with /account switch, then run this again to set up that account too.' })

    await interaction.editReply({ embeds: [embed] })
  }
}
