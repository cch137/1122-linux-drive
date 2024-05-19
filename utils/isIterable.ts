export default function isIterable (obj: any): boolean {
  try {
    return typeof obj[Symbol?.iterator] === 'function'
  } catch {
    return false
  }
}
