import { defineEventHandler, readBody, sendError, createError } from 'h3';
import { PIN } from '../../constants/app';

export default defineEventHandler(async (event) => {
  const req = event.node.req;
  const res = event.node.res;

  if (req.url !== '/api/check-pin' || req.method !== 'POST') {
    return;
  }

  try {
    const body = await readBody(event);
    const { pin } = body;

    if (!pin) {
      throw createError({ statusCode: 400, statusMessage: 'PIN is required' });
    }

    const isUnique = !PIN.includes(pin);

    return { isUnique };
  } catch (error) {
    //sendError(event, error);
  }
});
