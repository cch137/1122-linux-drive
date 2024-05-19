import MT from '~/utils/MersenneTwister'
import toSeed from '~/utils/toSeed'
import baseConverter from '~/utils/baseConverter'
import type { MersenneTwister } from '~/utils/MersenneTwister'

const {
  BASE10_CHARSET,
  BASE16_CHARSET,
  BASE64WEB_CHARSET
} = baseConverter

const _MT = MT()

const rand = (mt: MersenneTwister = _MT) => {
  return mt.random()
}

/** start 會包括，end 不會包括 */
const randInt = (start: number, end: number, mt?: MersenneTwister) => {
  if (end === undefined || end === 0) {
    end = start
    start = 0
  }
  return Math.floor(start + rand(mt) * end)
}

const choice = (array: any[] | string, mt?: MersenneTwister) => {
  return array[randInt(0, array.length, mt)]
}

const choices = (array: any[] | string, amount = 1, mt?: MersenneTwister) => {
  const result = []
  const options = []
  for (let i = 0; i < amount; i++) {
    if (options.length === 0) {
      options.push(...array)
    }
    result.push(options.splice(randInt(0, options.length, mt), 1)[0])
  }
  return result
}

const shuffle = (array: any[] | string, mt?: MersenneTwister) => {
  return choices(array, array.length, mt)
}

const charset = (charset: any | string[], len = 8, mt?: MersenneTwister) => {
  return new Array(len).fill(0).map(_ => choice(charset, mt)).join('')
}

const random = {
  MT,
  toSeed,
  rand,
  randInt,
  charset,
  choice,
  choices,
  shuffle,
  base10: (len = 6, mt?: MersenneTwister) => {
    return charset(BASE10_CHARSET, len, mt)
  },
  base16: (len = 32, mt?: MersenneTwister) => {
    return charset(BASE16_CHARSET, len, mt)
  },
  base64: (len = 32, mt?: MersenneTwister) => {
    return charset(BASE64WEB_CHARSET, len, mt)
  },
  /** Linear Congruential Generator */
  lcg (_seed: any) {
    let seed = toSeed(_seed)
    return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296
  }
}

export default random
