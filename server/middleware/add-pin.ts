import { defineEventHandler, readBody, sendError, createError } from 'h3';
import { PIN } from '../../constants/app';

export default defineEventHandler(async (event) => {
  const req = event.node.req;
  const res = event.node.res;

  if (req.url !== '/api/add-pin' || req.method !== 'POST') {
    return;
  }

  try {
    const body = await readBody(event);

    if (!body || typeof body !== 'object') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid JSON body' });
    }

    const pin = body.pin;

    if (!pin) {
      throw createError({ statusCode: 400, statusMessage: 'PIN is required' });
    }

    if (!PIN.includes(pin)) {
      PIN.push(pin);
    }

    return { success: true };
  } catch (error) {
    //sendError(event, error);
  }
});
