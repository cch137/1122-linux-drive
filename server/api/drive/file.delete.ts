import fs from 'fs'
import { PIN, SALT } from '~/constants/app'
import { parse as parseCookie } from 'cookie'
import drive from '~/server/services/drive'
import troll from '~/utils/troll'
import { readBody } from 'h3'

export default defineEventHandler(async function (event): Promise<{ error?: string, data: boolean }> {
  const { req, res } = event.node
  try {
    const pin = troll.d(parseCookie(req.headers.cookie || '')?.token || '', 2, SALT);
    if (pin != PIN) {
      return { error: 'Not logged in.', data: false };
    }
  } catch {}
  const fp = (await readBody(event))?.fp;
  if (fp) await drive.deleteFile(fp);
  return { data: true };
})
