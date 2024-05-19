import { PIN, SALT } from '~/constants/app'
import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import troll from '~/utils/troll'

export default defineEventHandler(async function (event): Promise<{ error?: string, isLoggedIn: boolean }> {
  const { req, res } = event.node
  try {
    const pin = troll.d(parseCookie(req.headers.cookie || '')?.token || '', 2, SALT);
    if (pin == PIN) {
      return { isLoggedIn: true };
    }
  } catch {}

  res.setHeader('Set-Cookie', serializeCookie('token', '', {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: true,
    expires: new Date(),
  }));

  return { isLoggedIn: false, error: 'Not logged in.' };
})