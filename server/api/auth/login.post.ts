import { PIN, SALT } from '~/constants/app'
import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import RateLimiter from '~/server/utils/rate-limiter'
import getIp from '~/server/utils/get-ip'
import troll from '~/utils/troll'

// Every 5 minutes 5 times
const rateLimiter = new RateLimiter(5, 5 * 60 * 1000)

export default defineEventHandler(async function (event): Promise<{ error?: string, isLoggedIn: boolean }> {
  const { req, res } = event.node
  if (!rateLimiter.check(getIp(req))) {
    return { isLoggedIn: false, error: rateLimiter.hint }
  }
  const pin = (await readBody(event) as { pin?: string })?.pin;
  // @ts-ignore
  if (pin !== PIN) {
    return { isLoggedIn: false, error: 'Incorrect pin.' }
  }

  res.setHeader('Set-Cookie', serializeCookie('token', troll.e(pin, 2 , SALT), {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: true,
  }));

  return { isLoggedIn: true };
})