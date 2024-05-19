import toSeed from '~/utils/toSeed'

const N = 624
const M = 397
const MATRIX_A = 0x9908B0DF
const UPPER_MASK = 0x80000000
const LOWER_MASK = 0x7FFFFFFF

class MersenneTwister {
  mt = new Array(N)
  mti = N + 1
  seed: number

  /** @param {Number} [seed] */
  constructor (seed: any) {
    this.seed = seed = toSeed(seed)
    if (Array.isArray(seed)) {
      this.init_by_array(seed, seed.length)
    } else {
      this.init_seed(seed)
    }
    return this
  }

  init_seed (s: number) {
    this.mt[0] = s >>> 0
    for (this.mti = 1; this.mti < N; this.mti++) {
      s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)
      this.mt[this.mti] = (((((s & 0xFFFF0000) >>> 16) * 1812433253) << 16) + (s & 0x0000FFFF) * 1812433253) + this.mti
      this.mt[this.mti] >>>= 0
    }
  }

  init_by_array (initKey: number[], keyLength: number) {
    let i, j, k
    this.init_seed(19650218)
    i = 1
    j = 0
    k = N > keyLength ? N : keyLength
    for (; k !== 0; k--) {
      const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
      this.mt[i] = (this.mt[i] ^ (((((s & 0xFFFF0000) >>> 16) * 1664525) << 16) + ((s & 0x0000FFFF) * 1664525))) + initKey[j] + j
      this.mt[i] >>>= 0
      i++
      j++
      if (i >= N) {
        this.mt[0] = this.mt[N - 1]
        i = 1
      }
      if (j >= keyLength) {
        j = 0
      }
    }
    for (k = N - 1; k !== 0; k--) {
      const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
      this.mt[i] = (this.mt[i] ^ (((((s & 0xFFFF0000) >>> 16) * 1566083941) << 16) + (s & 0x0000FFFF) * 1566083941)) - i
      this.mt[i] >>>= 0
      i++
      if (i >= N) {
        this.mt[0] = this.mt[N - 1]
        i = 1
      }
    }
    this.mt[0] = 0x80000000
  }

  random_int () {
    let y
    const mag01 = new Array<number>(0x0, MATRIX_A)
    if (this.mti >= N) {
      let kk
      if (this.mti === N + 1) {
        this.init_seed(5489)
      }
      for (kk = 0; kk < N - M; kk++) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK)
        this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1]
      }
      for (; kk < N - 1; kk++) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK)
        this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1]
      }
      y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK)
      this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1]
      this.mti = 0
    }
    y = this.mt[this.mti++]
    y ^= (y >>> 11)
    y ^= (y << 7) & 0x9D2C5680
    y ^= (y << 15) & 0xEFC60000
    y ^= (y >>> 18)
    return y >>> 0
  }

  random_int31 () {
    return (this.random_int() >>> 1)
  }

  random_incl () {
    return (this.random_int() * (1.0 / 4294967295.0))
  }

  random () {
    return (this.random_int() * (1.0 / 4294967296.0))
  }

  random_excl () {
    return (this.random_int() + 0.5) * (1.0 / 4294967296.0)
  }

  random_long () {
    return ((this.random_int() >>> 5) * 67108864 + (this.random_int() >>> 6)) * (1.0 / 9007199254740992.0)
  }
}

export default function MT (seed?: any) {
  return new MersenneTwister(seed)
}

export {
  MersenneTwister
}
