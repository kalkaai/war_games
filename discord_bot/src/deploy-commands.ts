/**
 * Run once to register slash commands with Discord:
 *   npm run deploy-commands
 */
import 'dotenv/config'
import { REST, Routes } from 'discord.js'
import * as timerCommand from './commands/timer'
import * as accountCommand from './commands/account'
import * as alertsCommand from './commands/alerts'
import * as upgradeCommand from './commands/upgrade'

const commands = [
  timerCommand.data.toJSON(),
  accountCommand.data.toJSON(),
  alertsCommand.data.toJSON(),
  upgradeCommand.data.toJSON(),
]

const rest = new REST().setToken(process.env.DISCORD_TOKEN!)

;(async () => {
  try {
    console.log('Registering slash commands...')

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commands },
    )

    console.log('Done. Commands registered globally.')
  } catch (err) {
    console.error('Failed to register commands:', err)
    process.exit(1)
  }
})()
