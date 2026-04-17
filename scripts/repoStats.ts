#!/usr/bin/env node
/// <reference types="node" />

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_REPO = 'wisemen-digital/wisemen-core'
const DEFAULT_DAYS = 30
const ITEMS_PER_PAGE = 100

type RepoStatsOptions = {
  repo: string
  days: number
  json: boolean
  token: string
  help?: boolean
}

function parseArgs(argv: string[]): RepoStatsOptions {
  const options: RepoStatsOptions = {
    repo: process.env.GITHUB_REPOSITORY || DEFAULT_REPO,
    days: DEFAULT_DAYS,
    json: false,
    token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '',
  }

  for (let index = 2; index < argv.length; index += 1) {
    const value = argv[index]

    if (value === '--repo' && argv[index + 1]) {
      options.repo = argv[index + 1]
      index += 1
      continue
    }

    if (value.startsWith('--repo=')) {
      options.repo = value.slice('--repo='.length)
      continue
    }

    if (value === '--days' && argv[index + 1]) {
      options.days = Number(argv[index + 1])
      index += 1
      continue
    }

    if (value.startsWith('--days=')) {
      options.days = Number(value.slice('--days='.length))
      continue
    }

    if (value === '--json') {
      options.json = true
      continue
    }

    if (value === '--token' && argv[index + 1]) {
      options.token = argv[index + 1]
      index += 1
      continue
    }

    if (value.startsWith('--token=')) {
      options.token = value.slice('--token='.length)
      continue
    }

    if (value === '--help' || value === '-h') {
      options.help = true
    }
  }

  return options
}

function buildHeaders(token: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'wisemen-core-repo-stats',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function requestJson(url: string, headers: Record<string, string>) {
  const response = await fetch(url, { headers })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`GitHub API request failed (${response.status} ${response.statusText}) for ${url}\n${body}`)
  }

  return response.json()
}

async function paginate<T>(urlFactory: (page: number) => string, headers: Record<string, string>) {
  const items: T[] = []

  for (let page = 1; page <= 10; page += 1) {
    const url = urlFactory(page)
    const data = await requestJson(url, headers)

    if (!Array.isArray(data) || data.length === 0) {
      break
    }

    items.push(...(data as T[]))

    if (data.length < ITEMS_PER_PAGE) {
      break
    }
  }

  return items
}

function getSinceDate(days: number) {
  const millis = Math.max(1, Number(days) || DEFAULT_DAYS) * 24 * 60 * 60 * 1000
  return new Date(Date.now() - millis)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(date)
}

function formatCountMap(countMap: Map<string, number>, limit = 5) {
  return [...countMap.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
}

async function getCommitStats(owner: string, repo: string, sinceIso: string, headers: Record<string, string>) {
  const commits = await paginate<any>(
    (page) => {
      const params = new URLSearchParams({ since: sinceIso, per_page: String(ITEMS_PER_PAGE), page: String(page) })
      return `https://api.github.com/repos/${owner}/${repo}/commits?${params}`
    },
    headers,
  )

  const authors = new Map<string, number>()

  for (const commit of commits) {
    const name = commit.author?.login || commit.commit?.author?.name || commit.commit?.author?.email || 'Unknown'
    authors.set(name, (authors.get(name) || 0) + 1)
  }

  return {
    total: commits.length,
    uniqueAuthors: authors.size,
    topAuthors: formatCountMap(authors),
  }
}

async function getReleases(owner: string, repo: string, sinceIso: string, headers: Record<string, string>) {
  const releases = await paginate<any>(
    (page) => {
      const params = new URLSearchParams({ per_page: String(ITEMS_PER_PAGE), page: String(page) })
      return `https://api.github.com/repos/${owner}/${repo}/releases?${params}`
    },
    headers,
  )

  return releases
    .filter((release) => !release.draft && release.published_at && release.published_at >= sinceIso)
    .map((release) => ({
      name: release.name || release.tag_name,
      tag: release.tag_name,
      publishedAt: release.published_at,
      prerelease: release.prerelease,
    }))
}

async function getSearchCount(query: string, headers: Record<string, string>) {
  const params = new URLSearchParams({ q: query, per_page: '1' })
  const data = await requestJson(`https://api.github.com/search/issues?${params}`, headers)
  return data.total_count || 0
}

async function getPackageCount(rootDir: string) {
  const packagesDir = path.join(rootDir, 'packages')
  const groupDirectories = await readdir(packagesDir, { withFileTypes: true })
  let total = 0

  for (const group of groupDirectories) {
    if (!group.isDirectory()) {
      continue
    }

    const groupPath = path.join(packagesDir, group.name)
    const entries = await readdir(groupPath, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue
      }

      const packageJsonPath = path.join(groupPath, entry.name, 'package.json')

      try {
        await readFile(packageJsonPath, 'utf8')
        total += 1
      } catch {
        continue
      }
    }
  }

  return total
}

function printHelp() {
  process.stdout.write(`Usage: node --experimental-strip-types ./scripts/repo-stats.ts [options]\n\nOptions:\n  --repo owner/name   Repository to inspect\n  --days number       Number of days to look back (default: ${DEFAULT_DAYS})\n  --token value       GitHub token to use for authenticated requests\n  --json              Print JSON instead of text\n  -h, --help          Show help\n`)
}

async function main() {
  const options = parseArgs(process.argv)

  if (options.help) {
    printHelp()
    return
  }

  const [owner, repo] = options.repo.split('/')

  if (!owner || !repo) {
    throw new Error(`Invalid repo format: ${options.repo}. Expected owner/name.`)
  }

  const rootDir = process.cwd()
  const since = getSinceDate(options.days)
  const sinceIso = since.toISOString()
  const headers = buildHeaders(options.token)

  const [packageCount, commitStats, releases, mergedPullRequests, closedIssues] = await Promise.all([
    getPackageCount(rootDir),
    getCommitStats(owner, repo, sinceIso, headers),
    getReleases(owner, repo, sinceIso, headers),
    getSearchCount(`repo:${owner}/${repo} is:pr is:merged merged:>=${sinceIso.slice(0, 10)}`, headers),
    getSearchCount(`repo:${owner}/${repo} is:issue is:closed closed:>=${sinceIso.slice(0, 10)}`, headers),
  ])

  const payload = {
    repo: options.repo,
    periodDays: options.days,
    since: sinceIso,
    until: new Date().toISOString(),
    packages: {
      total: packageCount,
    },
    releases: {
      total: releases.length,
      items: releases,
    },
    commits: commitStats,
    pullRequests: {
      merged: mergedPullRequests,
    },
    issues: {
      closed: closedIssues,
    },
  }

  if (options.json) {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`)
    return
  }

  process.stdout.write(`Repository stats for ${options.repo}\n`)
  process.stdout.write(`Window: ${formatDate(since)} to ${formatDate(new Date())} UTC\n\n`)
  process.stdout.write(`Total packages: ${payload.packages.total}\n`)
  process.stdout.write(`Releases published: ${payload.releases.total}\n`)
  process.stdout.write(`Merged pull requests: ${payload.pullRequests.merged}\n`)
  process.stdout.write(`Closed issues: ${payload.issues.closed}\n`)
  process.stdout.write(`Commits: ${payload.commits.total}\n`)
  process.stdout.write(`Unique commit authors: ${payload.commits.uniqueAuthors}\n`)

  if (payload.commits.topAuthors.length > 0) {
    process.stdout.write(`Top commit authors:\n`)
    for (const [name, count] of payload.commits.topAuthors) {
      process.stdout.write(`  - ${name}: ${count}\n`)
    }
  }

  if (payload.releases.items.length > 0) {
    process.stdout.write(`Recent releases:\n`)
    for (const release of payload.releases.items.slice(0, 5)) {
      const label = release.prerelease ? `${release.name} (pre-release)` : release.name
      process.stdout.write(`  - ${label} · ${formatDate(new Date(release.publishedAt))}\n`)
    }
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})