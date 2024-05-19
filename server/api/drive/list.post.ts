import { PIN, SALT } from '~/constants/app'
import { parse as parseCookie } from 'cookie'
import drive from '~/server/services/drive'
import troll from '~/utils/troll'

export default defineEventHandler(async function (event): Promise<{ error?: string, data: string[] }> {
  const { req, res } = event.node
  try {
    const pin = troll.d(parseCookie(req.headers.cookie || '')?.token || '', 2, SALT);
    if (pin != PIN) {
      return { error: 'Not logged in.', data: [] };
    }
  } catch {}
  return { data: drive.fileList() };
})
