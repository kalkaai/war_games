/**
 * One-time script: downloads hero portrait images from external URLs
 * and saves them locally to public/assets/heroes/.
 *
 * Run from the web/ directory:
 *   node scripts/download-portraits.mjs
 *
 * After running, update heroes.json portrait fields to use local paths.
 * The script prints the updated JSON entries so you can copy-paste.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const HEROES_JSON = join(ROOT, 'data', 'heroes.json')
const OUTPUT_DIR = join(ROOT, 'public', 'assets', 'heroes')

async function main() {
  const raw = JSON.parse(readFileSync(HEROES_JSON, 'utf8'))
  const heroes = raw.heroes

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
    console.log(`Created ${OUTPUT_DIR}`)
  }

  const results = []
  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const hero of heroes) {
    if (!hero.portrait || !hero.portrait.startsWith('http')) {
      console.log(`[skip] ${hero.id}: already local or no portrait`)
      skipped++
      results.push({ id: hero.id, portrait: hero.portrait })
      continue
    }

    const url = hero.portrait
    const filename = basename(new URL(url).pathname)
    const localPath = join(OUTPUT_DIR, filename)
    const publicPath = `/assets/heroes/${filename}`

    if (existsSync(localPath)) {
      console.log(`[exists] ${hero.id}: ${filename}`)
      skipped++
      results.push({ id: hero.id, portrait: publicPath })
      continue
    }

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      writeFileSync(localPath, buf)
      console.log(`[ok] ${hero.id}: ${filename} (${(buf.length / 1024).toFixed(1)} KB)`)
      downloaded++
      results.push({ id: hero.id, portrait: publicPath })
    } catch (err) {
      console.error(`[fail] ${hero.id}: ${url} — ${err.message}`)
      failed++
      results.push({ id: hero.id, portrait: url })
    }
  }

  console.log(`\nDone: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed`)

  // Write updated heroes.json with local portrait paths
  const updated = {
    ...raw,
    heroes: raw.heroes.map((h) => {
      const result = results.find((r) => r.id === h.id)
      return result ? { ...h, portrait: result.portrait } : h
    }),
  }

  writeFileSync(HEROES_JSON, JSON.stringify(updated, null, 2) + '\n')
  console.log(`Updated ${HEROES_JSON}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
