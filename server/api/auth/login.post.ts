import { SALT } from "~/constants/app";
// import RateLimiter from "@cch137/utils/rate-limiter";
// import getRequestIp from "@cch137/utils/server/get-request-ip";
import { Shuttle } from "@cch137/utils/shuttle";
import { parse as parseCookie, serialize as serializeCookie } from "cookie";
import auth from "~/server/services/auth";

// const rateLimiter = new RateLimiter([{ maxCount: 5, timeMs: 1 * 60 * 60 }]);

export type AuthCheckResult = {
  roomId: string | null;
  error?: string;
};

export default defineEventHandler(async function (
  event
): Promise<AuthCheckResult> {
  const { req, res } = event.node;
  // const rateCheck = rateLimiter.check(getRequestIp(req));
  // if (!rateCheck.success) return { roomId: null, error: rateCheck.message };

  const roomId = (await readBody(event))?.roomId;
  if (!auth.isPin(roomId)) {
    try {
      const roomId = Shuttle.unpackWithHash(
        parseCookie(req.headers.cookie || "")?.token || "",
        "MD5",
        SALT
      );
      if (auth.isPin(roomId)) return { roomId };
    } catch {}
    return { roomId: null };
  }

  if (auth.isPin(roomId)) {
    res.setHeader(
      "Set-Cookie",
      serializeCookie(
        "token",
        Shuttle.packWithHash(roomId, "MD5", SALT).toBase64URL(),
        {
          path: "/",
          httpOnly: true,
          sameSite: true,
          secure: true,
        }
      )
    );
    return { roomId };
  }

  return { roomId: null };
});
