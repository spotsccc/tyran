export function simplifyNumberString(s: string): string {
  if (s === '0') {
    return s
  }
  let res = ''
  let current = ''
  let isAfterDot = false
  for (const ch of s) {
    current += ch
    if (ch === '.') {
      isAfterDot = true
    }
    if ((ch !== '0' && ch !== '.') || !isAfterDot) {
      res += current
      current = ''
    }
  }
  return res
}
