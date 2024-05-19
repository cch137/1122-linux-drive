import { PIN, SALT } from '~/constants/app'
import { parse as parseCookie } from 'cookie'
import drive from '~/server/services/drive'
import troll from '~/utils/troll'

export default defineEventHandler(async function (event) {
  const { req, res } = event.node
  try {
    const pin = troll.d(parseCookie(req.headers.cookie || '')?.token || '', 2, SALT);
    if (pin != PIN) {
      return { error: 'Not logged in.', data: [] };
    }
  } catch {}
  res.writeHead(200, 'OK', {
    'Content-Type': 'text/event-stream',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  function driveOnchange() {
    res.write('1');
  }
  drive.eventTarget.addEventListener('change', driveOnchange);
  setTimeout(() => {
    res.end();
    drive.eventTarget.removeEventListener('change', driveOnchange);
  }, 60 * 1000);
  return;
})
