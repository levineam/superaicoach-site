// Zips each folder in /skills into public/skills/<slug>.zip, with the files
// inside a <slug>/ folder, which is the layout Claude and ChatGPT expect.
// Runs before `next dev` and `next build`, so the downloads always match the source.
// No dependencies: entries are stored uncompressed (the files are a few KB).

import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const srcDir = path.join(root, 'skills')
const outDir = path.join(root, 'public', 'skills')

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

// Fixed timestamp (2026-01-01 00:00) so rebuilding unchanged skills gives identical files.
const DOS_TIME = 0
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1

function zip(entries) {
  const locals = []
  const centrals = []
  let offset = 0
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, 'utf8')
    const crc = crc32(data)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4) // version needed
    local.writeUInt16LE(0x0800, 6) // UTF-8 names
    local.writeUInt16LE(0, 8) // stored
    local.writeUInt16LE(DOS_TIME, 10)
    local.writeUInt16LE(DOS_DATE, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)
    local.writeUInt16LE(0, 28)
    locals.push(local, nameBuf, data)

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4) // version made by
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0x0800, 8)
    central.writeUInt16LE(0, 10)
    central.writeUInt16LE(DOS_TIME, 12)
    central.writeUInt16LE(DOS_DATE, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(nameBuf.length, 28)
    central.writeUInt32LE(offset, 42)
    centrals.push(central, nameBuf)
    offset += local.length + nameBuf.length + data.length
  }
  const centralSize = centrals.reduce((n, b) => n + b.length, 0)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(centralSize, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, ...centrals, end])
}

mkdirSync(outDir, { recursive: true })
// Clear old ZIPs only, so a renamed or removed skill doesn't leave a stale download.
for (const f of readdirSync(outDir)) if (f.endsWith('.zip')) rmSync(path.join(outDir, f))

const slugs = readdirSync(srcDir).filter((d) => statSync(path.join(srcDir, d)).isDirectory())
for (const slug of slugs) {
  const dir = path.join(srcDir, slug)
  const skill = readFileSync(path.join(dir, 'SKILL.md'), 'utf8')
  const name = skill.match(/^---\n[\s\S]*?^name:\s*(\S+)/m)?.[1]
  if (name !== slug) throw new Error(`skills/${slug}/SKILL.md must have "name: ${slug}"`)
  const files = readdirSync(dir).filter((f) => statSync(path.join(dir, f)).isFile()).sort()
  const entries = files.map((f) => ({ name: `${slug}/${f}`, data: readFileSync(path.join(dir, f)) }))
  writeFileSync(path.join(outDir, `${slug}.zip`), zip(entries))
  console.log(`skills: ${slug}.zip (${files.join(', ')})`)
}
