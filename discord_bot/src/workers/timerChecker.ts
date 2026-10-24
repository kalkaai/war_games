import cron from 'node-cron'
import { Client } from 'discord.js'
import { runAlertCheck } from '../services/alertService'
import { runAllianceChannelAlertCheck } from '../services/allianceAlertService'

/**
 * Starts a cron job that runs every minute and sends DM alerts
 * for personal timers as well as automated alliance channel broadcasts.
 */
export function startTimerChecker(client: Client): void {
  cron.schedule('* * * * *', async () => {
    try {
      await Promise.allSettled([
        runAlertCheck(client),
        runAllianceChannelAlertCheck(client),
      ])
    } catch (err) {
      console.error('[TimerChecker] Error during alert check:', err)
    }
  })

  console.log('[TimerChecker] Started — checking personal timers & alliance alerts every minute.')
}
