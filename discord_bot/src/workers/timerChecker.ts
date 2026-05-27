import cron from 'node-cron'
import { Client } from 'discord.js'
import { runAlertCheck } from '../services/alertService'

/**
 * Starts a cron job that runs every minute and sends DM alerts
 * for any timers that are within a user's configured alert thresholds.
 */
export function startTimerChecker(client: Client): void {
  cron.schedule('* * * * *', async () => {
    try {
      await runAlertCheck(client)
    } catch (err) {
      console.error('[TimerChecker] Error during alert check:', err)
    }
  })

  console.log('[TimerChecker] Started — checking timers every minute.')
}
