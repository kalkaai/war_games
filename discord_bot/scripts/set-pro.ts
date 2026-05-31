/**
 * One-off script: set isPro: true for a given Discord user ID.
 * Usage: npx ts-node scripts/set-pro.ts <discordId>
 */
import { setProStatus } from '../src/services/accountService'

const discordId = process.argv[2]
if (!discordId) {
  console.error('Usage: npx ts-node scripts/set-pro.ts <discordId>')
  process.exit(1)
}

setProStatus(discordId, true)
  .then(() => { console.log(`Set isPro=true for ${discordId}`); process.exit(0) })
  .catch((err) => { console.error(err); process.exit(1) })
