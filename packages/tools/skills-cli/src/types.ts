export interface SkillFrontmatter {
  name: string
  [key: string]: unknown
  description: string
  library?: string
  library_version?: string
  requires?: string[]
  sources?: string[]
  type?: string
}

export interface DiscoveredSkill {
  body: string
  frontmatter: SkillFrontmatter
  packageName: string
  packageShortName: string
  packageVersion: string
  raw: string
  skillName: string
  skillPath: string
}

export interface DiscoveredPackage {
  name: string
  shortName: string
  skills: DiscoveredSkill[]
  skillsDir: string
  version: string
}

export interface RenderedFile {
  content: string
  path: string
}

export interface AdapterContext {
  config: ResolvedConfig
  packages: DiscoveredPackage[]
  projectRoot: string
}

export interface Adapter {
  name: string
  render: (ctx: AdapterContext) => Promise<RenderedFile[]> | RenderedFile[]
}

export type TargetName = 'agents-md' | 'claude' | 'llms-txt'

export interface Config {
  agentsMd?: { path?: string }
  claude?: { outDir?: string }
  llmsTxt?: { path?: string }
  packages?: {
    allow?: string[]
    deny?: string[]
    unscoped?: string[]
  }
  targets?: TargetName[]
}

export interface ResolvedConfig {
  agentsMd: { path: string }
  claude: { outDir: string }
  llmsTxt: { path: string }
  packages: {
    allow: string[] | null
    deny: string[]
    unscoped: string[]
  }
  targets: TargetName[]
}

export interface LockfileEntry {
  package: string
  skills: {
    name: string
    checksum: string
  }[]
  version: string
}

export interface Lockfile {
  generatedAt: string
  entries: LockfileEntry[]
  version: 1
}
