import sha3 from 'crypto-js/sha3.js';
import md5 from 'crypto-js/md5.js';

const PIN = "137112503023";
const SALT = "369112503023";

const str = (obj) => {
  try {
    if ((obj == null ? void 0 : obj.toString) === void 0) {
      return `${obj}`;
    } else {
      const _str = obj.toString();
      return _str.startsWith("[object ") && _str.endsWith("]") ? JSON.stringify(obj) : _str;
    }
  } catch {
    return "";
  }
};
const lower = (o) => {
  return str(o).toLowerCase();
};

function isIterable(obj) {
  try {
    return typeof obj[Symbol == null ? void 0 : Symbol.iterator] === "function";
  } catch {
    return false;
  }
}

function safeStringify(obj) {
  const seenObjects = /* @__PURE__ */ new Set();
  const reviver = (_, value) => {
    if (typeof value === "object" && value !== null) {
      if (seenObjects.has(value)) {
        return void 0;
      }
      seenObjects.add(value);
      if (isIterable(value)) {
        value = [...value];
      }
    }
    return value;
  };
  return JSON.stringify(obj, reviver);
}

const BASE2_CHARSET = "01";
const BASE10_CHARSET$1 = "0123456789";
const BASE16_CHARSET$1 = "0123456789abcdef";
const BASE36_CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";
const BASE62_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE64_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const BASE64WEB_CHARSET$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const getCharset$1 = (radix) => {
  if (typeof radix !== "string") {
    radix = lower(radix);
  }
  switch (radix) {
    case "2":
      return BASE2_CHARSET;
    case "10":
      return BASE10_CHARSET$1;
    case "16":
      return BASE16_CHARSET$1;
    case "36":
      return BASE36_CHARSET;
    case "62":
      return BASE62_CHARSET;
    case "64":
      return BASE64_CHARSET;
    case "64w":
    case "64+":
      return BASE64WEB_CHARSET$1;
    default:
      return radix;
  }
};
const convert$1 = (value, fromCharset, toCharset, minLen = 0) => {
  if (typeof value !== "string") {
    value = str(value);
  }
  let decimalValue = BigInt(0);
  fromCharset = getCharset$1(fromCharset);
  const baseFrom = fromCharset.length;
  for (let i = 0; i < value.length; i++) {
    decimalValue += BigInt(fromCharset.indexOf(value[i]) * Math.pow(baseFrom, value.length - 1 - i));
  }
  let result = "";
  toCharset = getCharset$1(toCharset);
  if (result === "") {
    const baseTo = BigInt(toCharset.length);
    while (decimalValue > 0) {
      result = toCharset.charAt(+BigInt(decimalValue % baseTo).toString()) + result;
      decimalValue = BigInt(decimalValue / baseTo);
    }
  }
  return (result === "" ? toCharset.charAt(0) : result).padStart(minLen, toCharset[0]);
};
const textToBase64$1 = (text) => {
  const input = text.split("").map((c) => c.charCodeAt(0));
  const output = [];
  let i = 0;
  while (i < input.length) {
    const [char1, char2 = 0, char3 = 0] = input.slice(i, i += 3);
    const triplet = (char1 << 16) + (char2 << 8) + char3;
    const char4 = triplet >> 18;
    const char5 = triplet >> 12 & 63;
    const char6 = triplet >> 6 & 63;
    const char7 = triplet & 63;
    output.push(BASE64_CHARSET[char4], BASE64_CHARSET[char5], BASE64_CHARSET[char6], BASE64_CHARSET[char7]);
  }
  const paddingLength = input.length % 3;
  return output.join("").slice(0, 1 + output.length - paddingLength) + (paddingLength === 2 ? "==" : paddingLength === 1 ? "=" : "");
};
const secureBase64RegEx = /[^A-Za-z0-9+/]/g;
const secureBase64$1 = (str2) => str2.replace(secureBase64RegEx, "");
const fromCharCode = (str2) => String.fromCharCode(+str2);
const base64ToText$1 = (str2) => {
  const input = secureBase64$1(str2).split("");
  const output = [];
  let i = 0;
  while (i < input.length) {
    const [char1, char2, char3, char4] = input.slice(i, i += 4).map((l) => BASE64_CHARSET.indexOf(l));
    output.push(fromCharCode(char1 << 2 | char2 >> 4));
    if (char3 !== 64) {
      output.push(fromCharCode((char2 & 15) << 4 | char3 >> 2));
    }
    if (char4 !== 64) {
      output.push(fromCharCode((char3 & 3) << 6 | char4));
    }
  }
  return output.join("").replaceAll("\0", "");
};
const baseConverter = {
  BASE2_CHARSET,
  BASE10_CHARSET: BASE10_CHARSET$1,
  BASE16_CHARSET: BASE16_CHARSET$1,
  BASE36_CHARSET,
  BASE62_CHARSET,
  BASE64_CHARSET,
  BASE64WEB_CHARSET: BASE64WEB_CHARSET$1,
  convert: convert$1,
  getCharset: getCharset$1,
  secureBase64: secureBase64$1,
  textToBase64: textToBase64$1,
  base64ToText: base64ToText$1
};

function sum(...args) {
  return args.reduce((a, b) => a + b, 0);
}

const sha256 = (message) => {
  return sha3(message, { outputLength: 256 }).toString();
};
const binaryStrRegex = /0b[0-1]+/i;
function toSeed(seed) {
  if (typeof seed === "number") {
    return Math.round(seed);
  } else if (seed instanceof Object) {
    seed = safeStringify(seed);
  }
  if (typeof seed === "string") {
    if (binaryStrRegex.test(seed)) {
      return parseInt(seed.substring(2, seed.length - 1), 2);
    }
    const num = parseInt(seed);
    if (Number.isNaN(num)) {
      return num;
    } else {
      return sum(parseInt(sha256(seed), 16));
    }
  } else {
    return Date.now();
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const N = 624;
const M = 397;
const MATRIX_A = 2567483615;
const UPPER_MASK = 2147483648;
const LOWER_MASK = 2147483647;
class MersenneTwister {
  /** @param {Number} [seed] */
  constructor(seed) {
    __publicField(this, "mt", new Array(N));
    __publicField(this, "mti", N + 1);
    __publicField(this, "seed");
    this.seed = seed = toSeed(seed);
    if (Array.isArray(seed)) {
      this.init_by_array(seed, seed.length);
    } else {
      this.init_seed(seed);
    }
    return this;
  }
  init_seed(s) {
    this.mt[0] = s >>> 0;
    for (this.mti = 1; this.mti < N; this.mti++) {
      s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
      this.mt[this.mti] = (((s & 4294901760) >>> 16) * 1812433253 << 16) + (s & 65535) * 1812433253 + this.mti;
      this.mt[this.mti] >>>= 0;
    }
  }
  init_by_array(initKey, keyLength) {
    let i, j, k;
    this.init_seed(19650218);
    i = 1;
    j = 0;
    k = N > keyLength ? N : keyLength;
    for (; k !== 0; k--) {
      const s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
      this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1664525 << 16) + (s & 65535) * 1664525) + initKey[j] + j;
      this.mt[i] >>>= 0;
      i++;
      j++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
      if (j >= keyLength) {
        j = 0;
      }
    }
    for (k = N - 1; k !== 0; k--) {
      const s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
      this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1566083941 << 16) + (s & 65535) * 1566083941) - i;
      this.mt[i] >>>= 0;
      i++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
    }
    this.mt[0] = 2147483648;
  }
  random_int() {
    let y;
    const mag01 = new Array(0, MATRIX_A);
    if (this.mti >= N) {
      let kk;
      if (this.mti === N + 1) {
        this.init_seed(5489);
      }
      for (kk = 0; kk < N - M; kk++) {
        y = this.mt[kk] & UPPER_MASK | this.mt[kk + 1] & LOWER_MASK;
        this.mt[kk] = this.mt[kk + M] ^ y >>> 1 ^ mag01[y & 1];
      }
      for (; kk < N - 1; kk++) {
        y = this.mt[kk] & UPPER_MASK | this.mt[kk + 1] & LOWER_MASK;
        this.mt[kk] = this.mt[kk + (M - N)] ^ y >>> 1 ^ mag01[y & 1];
      }
      y = this.mt[N - 1] & UPPER_MASK | this.mt[0] & LOWER_MASK;
      this.mt[N - 1] = this.mt[M - 1] ^ y >>> 1 ^ mag01[y & 1];
      this.mti = 0;
    }
    y = this.mt[this.mti++];
    y ^= y >>> 11;
    y ^= y << 7 & 2636928640;
    y ^= y << 15 & 4022730752;
    y ^= y >>> 18;
    return y >>> 0;
  }
  random_int31() {
    return this.random_int() >>> 1;
  }
  random_incl() {
    return this.random_int() * (1 / 4294967295);
  }
  random() {
    return this.random_int() * (1 / 4294967296);
  }
  random_excl() {
    return (this.random_int() + 0.5) * (1 / 4294967296);
  }
  random_long() {
    return ((this.random_int() >>> 5) * 67108864 + (this.random_int() >>> 6)) * (1 / 9007199254740992);
  }
}
function MT$1(seed) {
  return new MersenneTwister(seed);
}

const {
  BASE10_CHARSET,
  BASE16_CHARSET,
  BASE64WEB_CHARSET
} = baseConverter;
const _MT = MT$1();
const rand = (mt = _MT) => {
  return mt.random();
};
const randInt$1 = (start, end, mt) => {
  if (end === void 0 || end === 0) {
    end = start;
    start = 0;
  }
  return Math.floor(start + rand(mt) * end);
};
const choice = (array, mt) => {
  return array[randInt$1(0, array.length, mt)];
};
const choices = (array, amount = 1, mt) => {
  const result = [];
  const options = [];
  for (let i = 0; i < amount; i++) {
    if (options.length === 0) {
      options.push(...array);
    }
    result.push(options.splice(randInt$1(0, options.length, mt), 1)[0]);
  }
  return result;
};
const shuffle$1 = (array, mt) => {
  return choices(array, array.length, mt);
};
const charset = (charset2, len = 8, mt) => {
  return new Array(len).fill(0).map((_) => choice(charset2, mt)).join("");
};
const random = {
  MT: MT$1,
  toSeed,
  rand,
  randInt: randInt$1,
  charset,
  choice,
  choices,
  shuffle: shuffle$1,
  base10: (len = 6, mt) => {
    return charset(BASE10_CHARSET, len, mt);
  },
  base16: (len = 32, mt) => {
    return charset(BASE16_CHARSET, len, mt);
  },
  base64: (len = 32, mt) => {
    return charset(BASE64WEB_CHARSET, len, mt);
  },
  /** Linear Congruential Generator */
  lcg(_seed) {
    let seed = toSeed(_seed);
    return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  }
};

const { MT, shuffle, randInt } = random;
const { convert, getCharset } = baseConverter;
const maskingCharsetGenerator = (_charset, mt) => {
  const charset = shuffle(_charset, mt);
  return () => {
    charset.push(charset.shift());
    return charset;
  };
};
const mask = (_string, charset = 16, level = 1, seed) => {
  const charsetNum = Number.isNaN(+charset) ? 64 : +charset;
  const realCharset = getCharset(charset);
  const seed1 = toSeed(seed !== void 0 ? seed : randInt(0, charsetNum));
  const mt1 = MT(seed1);
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1e6, mt1)));
  const characters = typeof _string === "string" ? _string.split("") : _string;
  const result = [
    seed !== void 0 ? realCharset[randInt(0, charsetNum)] : convert(seed1, 10, charset),
    ...characters.map((char) => generator()[realCharset.indexOf(char)])
  ];
  if (--level < 1) {
    return result.join("");
  }
  return mask(result, charset, level, seed);
};
const unmask = (string, charset = 16, level = 1, seed) => {
  const realCharset = getCharset(charset);
  const seed1 = toSeed(seed !== void 0 ? seed : +convert(string[0], charset, 10));
  const mt1 = MT(seed1);
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1e6, mt1)));
  const characters = (typeof string === "string" ? string.split("") : string).slice(1, string.length);
  const result = characters.map((char) => realCharset[generator().indexOf(char)]);
  if (--level < 1) {
    return result.join("");
  }
  return unmask(result, charset, level, seed);
};

const { textToBase64, base64ToText, secureBase64 } = baseConverter;
function e(input, maskLevel = 1, seed) {
  if (typeof input === "object") {
    input = safeStringify(input);
  } else if (typeof input !== "string") {
    input = str(input);
  }
  return mask(secureBase64(textToBase64(input)), 64, maskLevel, seed);
}
function d(input, maskLevel = 1, seed, tryParseJSON = true) {
  input = base64ToText(unmask(input, 64, maskLevel, seed));
  if (!tryParseJSON) {
    return input;
  }
  try {
    return JSON.parse(input);
  } catch (err) {
    return input;
  }
}
function hx(input, algorithm = 512, seed) {
  const encrypted = e(input, 1, seed).substring(1);
  if (algorithm === "MD5") {
    return md5(encrypted).toString();
  }
  return sha3(encrypted, { outputLength: algorithm }).toString();
}
const troll = { e, d, hx };

export { PIN as P, SALT as S, random as r, troll as t };
//# sourceMappingURL=troll.mjs.map
