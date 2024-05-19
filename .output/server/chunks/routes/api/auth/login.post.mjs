import { d as defineEventHandler, r as readBody } from '../../../runtime.mjs';
import { P as PIN, t as troll, S as SALT } from '../../../_/troll.mjs';
import { serialize } from 'cookie';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, key + "" , value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _getLimiterFailedAt, getLimiterFailedAt_fn, _nextUpdateAt, _updateTimeout, _frequencyMs, _run, run_fn;
const defaultFrequencyMs = 60 * 1e3;
const defaultLimit = 5;
function _formatTime(timeMs) {
  if (timeMs < 1e3) {
    return `1 second`;
  } else if (timeMs < 6e4) {
    const seconds = Math.floor(timeMs / 1e3);
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  } else if (timeMs < 36e5) {
    const minutes = Math.floor(timeMs / 6e4);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else {
    const hours = Math.floor(timeMs / 36e5);
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }
}
class RateLimiterBundler extends Set {
  constructor(limiters = []) {
    super(limiters);
    __privateAdd(this, _getLimiterFailedAt);
  }
  getHint(ip) {
    var _a;
    return ((_a = __privateMethod(this, _getLimiterFailedAt, getLimiterFailedAt_fn).call(this, ip)) == null ? void 0 : _a.hint) || "";
  }
  check(ip, weight = 1) {
    return [...this].map((limiter) => limiter.check(ip, weight)).filter((i) => !i).length === 0;
  }
}
_getLimiterFailedAt = new WeakSet();
getLimiterFailedAt_fn = function(ip) {
  return [...this].find((limiter) => !limiter._noRecordCheck(ip));
};
class RateLimiter extends Map {
  constructor(limit = defaultLimit, frequencyMs = defaultFrequencyMs) {
    super();
    __privateAdd(this, _run);
    __privateAdd(this, _nextUpdateAt, 0);
    __privateAdd(this, _updateTimeout, void 0);
    __privateAdd(this, _frequencyMs, defaultFrequencyMs);
    __publicField(this, "limit", defaultLimit);
    this.limit = limit;
    this.frequencyMs = frequencyMs;
    __privateMethod(this, _run, run_fn).call(this);
  }
  static bundle(limiters = []) {
    return new RateLimiterBundler(limiters);
  }
  /** set frequencyMs will clear the record */
  set frequencyMs(value) {
    const oldValue = __privateGet(this, _frequencyMs);
    __privateSet(this, _frequencyMs, value);
    if (oldValue !== value) {
      __privateMethod(this, _run, run_fn).call(this);
    }
  }
  get frequencyMs() {
    return __privateGet(this, _frequencyMs);
  }
  /** Readonly */
  get frequencySec() {
    return Math.round(__privateGet(this, _frequencyMs) / 1e3);
  }
  /** Readonly */
  get frequencyMin() {
    return Math.round(__privateGet(this, _frequencyMs) / 1e3 / 60);
  }
  get nextUpdateAt() {
    return __privateGet(this, _nextUpdateAt);
  }
  get updateCountdown() {
    return __privateGet(this, _nextUpdateAt) - Date.now();
  }
  get hint() {
    return `You have tried too many times. Please try again after ${_formatTime(this.updateCountdown)}.`;
  }
  get total() {
    return [...this.values()].reduce((sum, num) => sum + num, 0);
  }
  check(ip, weight = 1) {
    const times = this.get(ip) || 0;
    this.set(ip, times + weight);
    return times < this.limit;
  }
  _noRecordCheck(ip) {
    const times = this.get(ip) || 0;
    return times < this.limit;
  }
}
_nextUpdateAt = new WeakMap();
_updateTimeout = new WeakMap();
_frequencyMs = new WeakMap();
_run = new WeakSet();
run_fn = function() {
  clearTimeout(__privateGet(this, _updateTimeout));
  this.clear();
  __privateSet(this, _updateTimeout, setTimeout(() => __privateMethod(this, _run, run_fn).call(this), __privateGet(this, _frequencyMs)));
  __privateSet(this, _nextUpdateAt, Date.now() + __privateGet(this, _frequencyMs));
};

function getIp(req) {
  const ips = (req == null ? void 0 : req.headers["x-forwarded-for"]) || (req == null ? void 0 : req.headers["x-real-ip"]) || (req == null ? void 0 : req.ip) || "";
  return ips.split(",").map((i) => i.trim())[0];
}

const rateLimiter = new RateLimiter(5, 5 * 60 * 1e3);
const login_post = defineEventHandler(async function(event) {
  var _a;
  const { req, res } = event.node;
  if (!rateLimiter.check(getIp(req))) {
    return { isLoggedIn: false, error: rateLimiter.hint };
  }
  const pin = (_a = await readBody(event)) == null ? void 0 : _a.pin;
  if (pin !== PIN) {
    return { isLoggedIn: false, error: "Incorrect pin." };
  }
  res.setHeader("Set-Cookie", serialize("token", troll.e(pin, 2, SALT), {
    path: "/",
    httpOnly: true,
    sameSite: true,
    secure: true
  }));
  return { isLoggedIn: true };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
