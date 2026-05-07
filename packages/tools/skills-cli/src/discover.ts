import {
  existsSync,
  readFileSync,
  statSync,
} from 'node:fs'
import path from 'node:path'

import fg from 'fast-glob'

import { parseFrontmatter } from './frontmatter.js'
import type {
  DiscoveredPackage,
  DiscoveredSkill,
  ResolvedConfig,
} from './types.js'

interface PackageJsonShape {
  name: string
  version: string
}

const SCOPE_PREFIX = '@wisemen/'

function shortNameFromPackage(name: string): string {
  return name.startsWith(SCOPE_PREFIX) ? name.slice(SCOPE_PREFIX.length) : name
}

function packageAllowed(
  name: string,
  allow: string[] | null,
  deny: string[],
): boolean {
  if (deny.includes(name)) {
    return false
  }
  if (allow === null) {
    return true
  }

  return allow.includes(name)
}

async function locatePackagesWithSkills(
  projectRoot: string,
  unscoped: string[],
): Promise<string[]> {
  const dirs: string[] = []

  const scopedRoot = path.join(projectRoot, 'node_modules', '@wisemen')

  if (existsSync(scopedRoot)) {
    const entries = await fg('*/', {
      cwd: scopedRoot,
      deep: 1,
      onlyDirectories: true,
    })

    for (const entry of entries) {
      dirs.push(path.join(scopedRoot, entry))
    }
  }

  for (const name of unscoped) {
    const candidate = path.join(projectRoot, 'node_modules', name)

    if (existsSync(candidate)) {
      dirs.push(candidate)
    }
  }

  return dirs
}

function readPackageJson(packageDir: string): PackageJsonShape | null {
  const pkgPath = path.join(packageDir, 'package.json')

  if (!existsSync(pkgPath)) {
    return null
  }
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf8')) as PackageJsonShape
  }
  catch {
    return null
  }
}

function resolveSkillsDir(packageDir: string): string | null {
  const defaultDir = path.join(packageDir, 'skills')

  if (!existsSync(defaultDir)) {
    return null
  }
  if (!statSync(defaultDir).isDirectory()) {
    return null
  }

  return defaultDir
}

async function readSkills(
  packageName: string,
  packageVersion: string,
  skillsDir: string,
): Promise<DiscoveredSkill[]> {
  const files = await fg('**/SKILL.md', {
    absolute: true,
    cwd: skillsDir,
  })
  const skills: DiscoveredSkill[] = []

  for (const file of files) {
    const raw = readFileSync(file, 'utf8')
    const {
      body, frontmatter,
    } = parseFrontmatter(raw)

    skills.push({
      body,
      frontmatter,
      packageName,
      packageShortName: shortNameFromPackage(packageName),
      packageVersion,
      raw,
      skillDir: path.dirname(file),
      skillName: frontmatter.name,
      skillPath: file,
    })
  }

  skills.sort((a, b) => a.skillName.localeCompare(b.skillName))

  return skills
}

export async function discoverPackages(
  projectRoot: string,
  config: ResolvedConfig,
): Promise<DiscoveredPackage[]> {
  const dirs = await locatePackagesWithSkills(projectRoot, config.packages.unscoped)
  const out: DiscoveredPackage[] = []

  for (const dir of dirs) {
    const pkg = readPackageJson(dir)

    if (pkg === null) {
      continue
    }
    if (!packageAllowed(pkg.name, config.packages.allow, config.packages.deny)) {
      continue
    }
    const skillsDir = resolveSkillsDir(dir)

    if (skillsDir === null) {
      continue
    }
    const skills = await readSkills(pkg.name, pkg.version, skillsDir)

    if (skills.length === 0) {
      continue
    }

    out.push({
      name: pkg.name,
      shortName: shortNameFromPackage(pkg.name),
      skills,
      skillsDir,
      version: pkg.version,
    })
  }

  out.sort((a, b) => a.name.localeCompare(b.name))

  return out
}
