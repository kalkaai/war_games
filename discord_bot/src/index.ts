import 'dotenv/config'
import './firebase'  // init Firebase on startup
import { Client, GatewayIntentBits, Collection, Events, Interaction, AutocompleteInteraction } from 'discord.js'
import * as timerCommand from './commands/timer'
import * as accountCommand from './commands/account'
import * as alertsCommand from './commands/alerts'
import * as upgradeCommand from './commands/upgrade'
import * as helpCommand from './commands/help'
import { startTimerChecker } from './workers/timerChecker'

// --- Command registry ---

type Command = {
  data: { name: string; toJSON: () => unknown }
  execute: (interaction: any) => Promise<void>
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
}

const commands = new Collection<string, Command>()
commands.set(timerCommand.data.name, timerCommand)
commands.set(accountCommand.data.name, accountCommand)
commands.set(alertsCommand.data.name, alertsCommand)
commands.set(upgradeCommand.data.name, upgradeCommand)
commands.set(helpCommand.data.name, helpCommand)

// --- Discord client ---

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
})

client.once(Events.ClientReady, (c) => {
  console.log(`[GAMIDES] Logged in as ${c.user.tag}`)
  startTimerChecker(client)
})

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (interaction.isAutocomplete()) {
    const command = commands.get(interaction.commandName)
    if (command?.autocomplete) {
      try { await command.autocomplete(interaction) } catch { /* ignore */ }
    }
    return
  }

  if (!interaction.isChatInputCommand()) return

  const command = commands.get(interaction.commandName)
  if (!command) {
    console.warn(`[Command] Unknown command: ${interaction.commandName}`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (err) {
    console.error(`[Command: ${interaction.commandName}]`, err)
    const msg = { content: 'Something went wrong. Please try again.', flags: ['Ephemeral'] as const }
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg)
    } else {
      await interaction.reply(msg)
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
