export function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`
}

export function isLocalizedHomePath(path: string, homePath: string): boolean {
  return ensureTrailingSlash(path) === ensureTrailingSlash(homePath)
}
