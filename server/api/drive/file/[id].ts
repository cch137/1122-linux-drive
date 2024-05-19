import { PIN, SALT } from '~/constants/app'
import { parse as parseCookie } from 'cookie'
import drive from '~/server/services/drive'
import troll from '~/utils/troll'

export default defineEventHandler(async function (event): Promise<any> {
  const { req, res } = event.node
  try {
    const pin = troll.d(parseCookie(req.headers.cookie || '')?.token || '', 2, SALT);
    if (pin != PIN) {
      res.statusCode = 401;
      return '';
    }
  } catch {}
  const fp: string = (decodeURIComponent(req.url || '')).split('/').at(-1) as string || '';
  const fileData = drive.readFile(fp);
  if (!fileData.exists) {
    res.statusCode = 404;
    return fileData.content;
  }
  if (fileData.encoding) {
    res.setHeader('Content-Type', `${fileData.mimetype}; charset=${fileData.encoding.toLowerCase()}`);
  } else {
    res.setHeader('Content-Type', fileData.mimetype);
  }
  return fileData.content;
})
