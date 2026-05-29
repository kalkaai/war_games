import { Client, EmbedBuilder, Colors } from 'discord.js'
import { getActiveUsers, listAccounts } from './accountService'
import { getTimersDueForAlert, markAlertSent, addTimer, deleteTimerById } from './timerService'
import { TIMER_EMOJI } from '../types'
import { formatTimeUntil, formatDuration } from '../utils/formatDuration'

export async function runAlertCheck(client: Client): Promise<void> {
  const users = await getActiveUsers()

  await Promise.allSettled(users.map(async (user) => {
    const accounts = await listAccounts(user.discordId)

    // Fan out all account×threshold queries in parallel
    const checks = await Promise.all(
      accounts.flatMap((account) =>
        user.alertThresholds.map(async (threshold) => ({
          account,
          threshold,
          timers: await getTimersDueForAlert(user.discordId, account.name, threshold),
        })),
      ),
    )

    const dueChecks = checks.filter((c) => c.timers.length > 0)
    if (dueChecks.length === 0) return

    // Fetch Discord user + DM channel once per user, not once per timer
    let dmChannel: any
    try {
      const discordUser = await client.users.fetch(user.discordId)
      dmChannel = await discordUser.createDM()
    } catch (err) {
      console.warn(`[AlertCheck] Could not open DM for ${user.discordId}:`, err)
      return
    }

    await Promise.all(
      dueChecks.flatMap(({ account, threshold, timers }) =>
        timers.map(async (timer) => {
          try {
            const isExpiry = threshold === 0
            const isShield = timer.type === 'shield'
            const isRecurring = isExpiry && !!timer.recurring && !!timer.intervalMs

            let nextExpiry: Date | undefined
            if (isRecurring) {
              nextExpiry = timer.recurringMode === 'fixed'
                ? new Date(timer.expiresAt.toMillis() + timer.intervalMs!)
                : new Date(Date.now() + timer.intervalMs!)
            }

            const recurringFootnote = isRecurring && nextExpiry
              ? `\nNext reset ${formatTimeUntil(nextExpiry)} (every ${formatDuration(timer.intervalMs!)}).`
              : ''

            const embed = new EmbedBuilder()
              .setColor(isExpiry || isShield ? Colors.Red : Colors.Orange)
              .setTitle(
                isShield && isExpiry
                  ? '🚨 Shield Has Expired'
                  : isShield
                  ? '⚠️ Shield Expiry Warning'
                  : isExpiry
                  ? `${TIMER_EMOJI[timer.type]} Timer Expired — ${timer.label}`
                  : `${TIMER_EMOJI[timer.type]} Timer Alert — ${timer.label}`,
              )
              .setDescription(
                isShield && isExpiry
                  ? `Your shield has expired!\nLogin now to activate a new shield.`
                  : isShield
                  ? `Your shield expires ${formatTimeUntil(timer.expiresAt.toDate())}.\nLogin now to renew or your base will be exposed.`
                  : isExpiry
                  ? `**${timer.label}** (${timer.type}) has finished.${recurringFootnote}`
                  : `**${timer.label}** (${timer.type}) expires ${formatTimeUntil(timer.expiresAt.toDate())}.`,
              )
              .setFooter({ text: `GAMIDES — ${account.name}` })
              .setTimestamp()

            await dmChannel.send({ embeds: [embed] })
            await markAlertSent(user.discordId, account.name, timer.id, threshold)

            if (isRecurring && nextExpiry) {
              await addTimer(user.discordId, account.name, {
                type: timer.type,
                label: timer.label,
                expiresAt: nextExpiry,
                recurring: true,
                intervalMs: timer.intervalMs,
                recurringMode: timer.recurringMode,
              })
              await deleteTimerById(user.discordId, account.name, timer.id)
            }
          } catch (err) {
            console.warn(`[AlertCheck] Could not alert ${user.discordId} for timer ${timer.id}:`, err)
          }
        }),
      ),
    )
  }))
}
