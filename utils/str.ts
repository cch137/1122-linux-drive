const str = (obj: any): string => {
  try {
    if (obj?.toString === undefined) {
      return `${obj}`
    } else {
      const _str = obj.toString() as string
      return (_str.startsWith('[object ') && _str.endsWith(']'))
        ? JSON.stringify(obj)
        : _str
    }
  } catch {
    return ''
  }
}

const lower = (o: any): string => {
  return str(o).toLowerCase()
}

export {
  lower
}

export default str
