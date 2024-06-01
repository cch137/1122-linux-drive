import RateLimiter from "@cch137/utils/rate-limiter";
import getRequestIp from "@cch137/utils/server/get-request-ip";
import { defineEventHandler } from "h3";
import auth from "~/server/services/auth";

const rateLimiter = new RateLimiter([{ maxCount: 5, timeMs: 1 * 60 * 60 }]);

export default defineEventHandler(async function (event) {
  try {
    const checked = rateLimiter.check(getRequestIp(event.node.req));
    if (!checked.success) return "";
    return auth.generatePin();
  } catch {
    return "";
  }
});
