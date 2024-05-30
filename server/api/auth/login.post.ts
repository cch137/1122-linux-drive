import { PIN, SALT } from "~/constants/app";
import { serialize as serializeCookie } from "cookie";
import RateLimiter from "@cch137/utils/rate-limiter";
import getRequestIp from "@cch137/utils/server/get-request-ip";
import Shuttle from "@cch137/utils/shuttle";

const rateLimiter = new RateLimiter([{ maxCount: 5, timeMs: 1 * 60 * 60 }]);

export default defineEventHandler(async function (
  event
): Promise<{ error?: string; isLoggedIn: boolean }> {
  const { req, res } = event.node;
  const checked = rateLimiter.check(getRequestIp(req));
  if (!checked.success) return { isLoggedIn: false, error: checked.message };
  
  const pin = ((await readBody(event)) as { pin?: string })?.pin;
  if (!pin || !PIN.includes(pin)) return { isLoggedIn: false, error: "Incorrect pin." };

  res.setHeader(
    "Set-Cookie",
    serializeCookie(
      "token",
      Shuttle.packWithHash(pin, "MD5", SALT).toBase64URL(),
      {
        path: "/",
        httpOnly: true,
        sameSite: true,
        secure: true,
      }
    )
  );

  return { isLoggedIn: true };
});
