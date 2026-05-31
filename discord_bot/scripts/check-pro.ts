import { userRef } from '../src/firebase'
import { UserDoc } from '../src/types'

userRef('1167619443543785553').get()
  .then((s: any) => { console.log('isPro:', (s.data() as UserDoc).isPro); process.exit(0) })
  .catch((e: any) => { console.error(e); process.exit(1) })
