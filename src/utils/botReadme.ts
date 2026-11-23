// Public bot README rules. The backend also enforces this byte limit.
export const MAX_BOT_README_BYTES = 64 * 1024

export const readmeByteLength = (text: string): number => new TextEncoder().encode(text).byteLength

// Do not allow protocol-relative URLs, backslashes, script/data URLs, or controls.
// Link destinations are checked both here and by the HTML sanitizer at render time.
const isCleanURL = (value: string): boolean =>
  Boolean(value) && value === value.trim() && !/[\u0000-\u001f\u007f\\]/.test(value)

export const isSafeReadmeLink = (value: string): boolean => {
  if (!isCleanURL(value)) return false
  if (value.startsWith('#')) return value.length > 1
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try {
    const url = new URL(value)
    if (url.username || url.password) return false
    return url.protocol === 'https:' || url.protocol === 'http:' || url.protocol === 'mailto:'
  } catch {
    return false
  }
}

// External images: HTTPS only. No data:, blob:, file:, http:, or credentials.
export const isSafeReadmeImage = (value: string): boolean => {
  if (!isCleanURL(value)) return false
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}
