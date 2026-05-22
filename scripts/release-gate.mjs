#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const args = new Map()
const rawArgs = process.argv.slice(2)

for (let index = 0; index < rawArgs.length; index += 1) {
  const arg = rawArgs[index]

  if (!arg.startsWith('--')) {
    continue
  }

  const [key, ...valueParts] = arg.slice(2).split('=')
  const nextValue = rawArgs[index + 1]

  if (valueParts.length > 0) {
    args.set(key, valueParts.join('='))
  } else if (nextValue && !nextValue.startsWith('--')) {
    args.set(key, nextValue)
    index += 1
  } else {
    args.set(key, 'true')
  }
}

const stage = args.get('stage') || process.env.RELEASE_STAGE || 'preview'
const maturity = args.get('maturity') || process.env.RELEASE_MATURITY || 'internal-preview'
const releaseParent = args.get('release-parent') || process.env.RELEASE_PARENT_ISSUE || ''

const allowedStages = new Set(['preview', 'production'])
const allowedMaturity = new Set(['draft', 'internal-preview', 'release-candidate', 'public-stable'])

const failures = []
const warnings = []

function requireFile(path) {
  if (!existsSync(resolve(path))) {
    failures.push(`Missing required file: ${path}`)
  }
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(resolve(path), 'utf8'))
  } catch (error) {
    failures.push(`Could not parse ${path}: ${error.message}`)
    return null
  }
}

if (!allowedStages.has(stage)) {
  failures.push(`Invalid release stage "${stage}". Use preview or production.`)
}

if (!allowedMaturity.has(maturity)) {
  failures.push(
    `Invalid maturity "${maturity}". Use draft, internal-preview, release-candidate, or public-stable.`,
  )
}

requireFile('README.md')
requireFile('CHANGELOG.md')
requireFile('docs/release-management.md')
requireFile('docs/releases/2026-05-release-lane-checklist.md')

const pkg = readJson('package.json')

if (pkg) {
  for (const scriptName of ['lint', 'test', 'build']) {
    if (!pkg.scripts?.[scriptName]) {
      failures.push(`package.json is missing required script: ${scriptName}`)
    }
  }

  if (!pkg.version) {
    failures.push('package.json is missing a version field.')
  }
}

if (existsSync(resolve('CHANGELOG.md'))) {
  const changelog = readFileSync(resolve('CHANGELOG.md'), 'utf8')

  if (!/^## Unreleased/m.test(changelog)) {
    failures.push('CHANGELOG.md must keep an Unreleased section for pending site changes.')
  }

  if (!/SUP-\d+|Release Process|Release Parent/i.test(changelog)) {
    warnings.push('CHANGELOG.md does not appear to reference a release parent or release process entry.')
  }
}

if (stage === 'preview') {
  if (maturity === 'draft' || maturity === 'public-stable') {
    warnings.push(
      `Preview gate usually expects internal-preview or release-candidate maturity, received ${maturity}.`,
    )
  }
}

if (stage === 'production') {
  if (!releaseParent) {
    failures.push('Production gate requires --release-parent SUP-XXXX or RELEASE_PARENT_ISSUE.')
  }

  if (!/^SUP-\d+$/i.test(releaseParent)) {
    failures.push('Production release parent must look like SUP-XXXX.')
  }

  if (maturity !== 'public-stable') {
    failures.push('Production gate requires --maturity public-stable or RELEASE_MATURITY=public-stable.')
  }
}

for (const warning of warnings) {
  console.warn(`release-gate warning: ${warning}`)
}

if (failures.length > 0) {
  console.error(`release-gate failed for ${stage}`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`release-gate passed for ${stage} (${maturity})`)
