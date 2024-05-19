import fs from 'fs'
import { PIN, SALT } from '~/constants/app'
import { parse as parseCookie } from 'cookie'
import drive from '~/server/services/drive'
import troll from '~/utils/troll'
import random from '~/utils/random'

export default defineEventHandler(async function (event): Promise<{ error?: string, data: boolean }> {
  const { req, res } = event.node
  try {
    const pin = troll.d(parseCookie(req.headers.cookie || '')?.token || '', 2, SALT);
    if (pin != PIN) {
      return { error: 'Not logged in.', data: false };
    }
  } catch {}
  const files = await readMultipartFormData(event);
  if (files !== undefined) {
    await Promise.all(files.map((file) => {
      return drive.writeFile(
        file.filename || `${random.base16(16)}.${(file.type || '').split('/').at(-1)}`,
        file.data
      );
    }));
  }
  return { data: true };
})
