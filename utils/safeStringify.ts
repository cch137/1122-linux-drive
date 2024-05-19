import isIterable from './isIterable'

export default function safeStringify (obj: any): string {
  const seenObjects = new Set()
  const reviver = (_: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seenObjects.has(value)) {
        return undefined
      }
      seenObjects.add(value)
      if (isIterable(value)) {
        value = [...value]
      }
    }
    return value
  }
  return JSON.stringify(obj, reviver)
}
