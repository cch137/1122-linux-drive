const defaultFrequencyMs = 60 * 1000
const defaultLimit = 5

function _formatTime(timeMs: number): string {
  if (timeMs < 1000) {
    return `1 second`
  } else if (timeMs < 60000) {
    const seconds = Math.floor(timeMs / 1000)
    return `${seconds} second${seconds !== 1 ? 's' : ''}`
  } else if (timeMs < 3600000) {
    const minutes = Math.floor(timeMs / 60000)
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  } else {
    const hours = Math.floor(timeMs / 3600000)
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  }
}

class RateLimiterBundler extends Set<RateLimiter> {
  constructor (limiters: RateLimiter[] = []) {
    super(limiters)
  }

  #getLimiterFailedAt (ip: string) {
    return [...this].find((limiter) => !limiter._noRecordCheck(ip))
  }

  getHint (ip: string) {
    return this.#getLimiterFailedAt(ip)?.hint || ''
  }

  check (ip: string, weight = 1) {
    return [...this].map((limiter) => limiter.check(ip, weight))
      .filter(i => !i).length === 0
  }
}

class RateLimiter extends Map<string, number> {
  #nextUpdateAt = 0
  #updateTimeout?: NodeJS.Timeout
  #frequencyMs = defaultFrequencyMs
  limit = defaultLimit

  static bundle (limiters: RateLimiter[] = []) {
    return new RateLimiterBundler(limiters)
  }

  /** set frequencyMs will clear the record */
  set frequencyMs (value: number) {
    const oldValue = this.#frequencyMs
    this.#frequencyMs = value
    if (oldValue !== value) {
      this.#run()
    }
  }

  get frequencyMs () {
    return this.#frequencyMs
  }

  /** Readonly */
  get frequencySec () {
    return Math.round(this.#frequencyMs / 1000)
  }

  /** Readonly */
  get frequencyMin () {
    return Math.round(this.#frequencyMs / 1000 / 60)
  }

  get nextUpdateAt (): number {
    return this.#nextUpdateAt
  }

  get updateCountdown (): number {
    return this.#nextUpdateAt - Date.now()
  }

  get hint (): string {
    return `You have tried too many times. Please try again after ${_formatTime(this.updateCountdown)}.`
  }

  get total () {
    return [...this.values()].reduce((sum, num) => sum + num, 0)
  }

  constructor (limit = defaultLimit, frequencyMs = defaultFrequencyMs) {
    super()
    this.limit = limit
    this.frequencyMs = frequencyMs
    this.#run()
  }

  #run () {
    clearTimeout(this.#updateTimeout)
    this.clear()
    this.#updateTimeout = setTimeout(() => this.#run(), this.#frequencyMs)
    this.#nextUpdateAt = Date.now() + this.#frequencyMs
  }

  check (ip: string, weight = 1) {
    const times = this.get(ip) || 0
    this.set(ip, times + weight)
    return times < this.limit
  }

  _noRecordCheck (ip: string) {
    const times = this.get(ip) || 0
    return times < this.limit
  }
}

export default RateLimiter
