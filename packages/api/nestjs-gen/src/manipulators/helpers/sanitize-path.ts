export function sanitizePath (path: string): string {
  return path.replace(/^['"]|['"]$/g, '')
}
