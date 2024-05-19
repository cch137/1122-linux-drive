import random from '~/utils/random'
import toSeed from '~/utils/toSeed'
import baseConverter from '~/utils/baseConverter'
import type { MersenneTwister } from '~/utils/MersenneTwister'

const { MT, shuffle, randInt } = random
const { convert, getCharset } = baseConverter

const maskingCharsetGenerator = (_charset: string, mt?: MersenneTwister) => {
  const charset = shuffle(_charset, mt)
  return () => {
    charset.push(charset.shift())
    return charset
  }
}

const mask = (_string: string | string[], charset: number | string = 16, level = 1, seed?: any): string => {
  const charsetNum = Number.isNaN(+charset) ? 64 : +charset
  const realCharset = getCharset(charset)
  const seed1 = toSeed(seed !== undefined ? seed : randInt(0, charsetNum))
  const mt1 = MT(seed1)
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1000000, mt1)))
  const characters = typeof _string === 'string' ? _string.split('') : _string
  const result = [
    seed !== undefined ? realCharset[randInt(0, charsetNum)] : convert(seed1, 10, charset),
    ...characters.map(char => generator()[realCharset.indexOf(char)])
  ] as string[]
  if (--level < 1) {
    return result.join('')
  }
  return mask(result, charset, level, seed)
}

const unmask = (string: string | string[], charset: number | string = 16, level = 1, seed?: any): any => {
  const realCharset = getCharset(charset)
  const seed1 = toSeed(seed !== undefined ? seed : +convert(string[0], charset, 10))
  const mt1 = MT(seed1)
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1000000, mt1)))
  const characters = (typeof string === 'string' ? string.split('') : string).slice(1, string.length)
  const result = characters.map(char => realCharset[generator().indexOf(char)])
  if (--level < 1) {
    return result.join('')
  }
  return unmask(result, charset, level, seed)
}

export {
  mask,
  unmask
}
