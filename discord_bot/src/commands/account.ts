import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from 'discord.js'
import {
  getOrCreateUser,
  createAccount,
  switchAccount,
  listAccounts,
} from '../services/accountService'
import { FREE_TIER } from '../types'

export const data = new SlashCommandBuilder()
  .setName('account')
  .setDescription('Manage your game account profiles')
  .addSubcommand((sub) =>
    sub
      .setName('add')
      .setDescription('Create a new account profile')
      .addStringOption((opt) =>
        opt
          .setName('name')
          .setDescription('Profile name, e.g. "Main", "Farm 1"')
          .setRequired(true),
      ),
  )
  .addSubcommand((sub) =>
    sub
      .setName('switch')
      .setDescription('Switch to a different account profile')
      .addStringOption((opt) =>
        opt.setName('name').setDescription('Profile name to switch to').setRequired(true),
      ),
  )
  .addSubcommand((sub) =>
    sub.setName('list').setDescription('Show all your account profiles'),
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const user = await getOrCreateUser(interaction.user.id)
  const sub = interaction.options.getSubcommand()

  if (sub === 'add') {
    const name = interaction.options.getString('name', true).trim()

    const accounts = await listAccounts(interaction.user.id)

    if (!user.isPro && accounts.length >= FREE_TIER.MAX_ACCOUNTS) {
      await interaction.editReply(
        `Free tier supports **${FREE_TIER.MAX_ACCOUNTS} account profile**.\nUse \`/upgrade\` to unlock unlimited accounts.`,
      )
      return
    }

    const exists = accounts.some((a) => a.name.toLowerCase() === name.toLowerCase())
    if (exists) {
      await interaction.editReply(`An account named **${name}** already exists.`)
      return
    }

    await createAccount(interaction.user.id, name)
    await interaction.editReply(
      `Created account profile **${name}**.\nUse \`/account switch ${name}\` to activate it.`,
    )
    return
  }

  if (sub === 'switch') {
    const name = interaction.options.getString('name', true).trim()
    const accounts = await listAccounts(interaction.user.id)
    const match = accounts.find((a) => a.name.toLowerCase() === name.toLowerCase())

    if (!match) {
      await interaction.editReply(
        `No account named **${name}** found. Use \`/account list\` to see your profiles.`,
      )
      return
    }

    await switchAccount(interaction.user.id, match.name)
    await interaction.editReply(`Switched to **${match.name}**. All timer commands will now use this profile.`)
    return
  }

  if (sub === 'list') {
    const accounts = await listAccounts(interaction.user.id)

    const embed = new EmbedBuilder()
      .setColor(Colors.Blurple)
      .setTitle('Your Account Profiles')
      .setDescription(
        accounts
          .map((a) => {
            const active = a.name === user.activeAccount ? ' ← active' : ''
            return `• **${a.name}**${active}`
          })
          .join('\n') || 'No accounts found.',
      )
      .setFooter({
        text: user.isPro
          ? 'Pro — unlimited accounts'
          : `Free tier — ${accounts.length}/${FREE_TIER.MAX_ACCOUNTS} account`,
      })

    await interaction.editReply({ embeds: [embed] })
  }
}
