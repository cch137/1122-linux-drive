import { serialize as serializeCookie } from "cookie";
import type { AuthCheckResult } from "./login.post";

export default defineEventHandler(async function (
  event
): Promise<AuthCheckResult> {
  event.node.res.setHeader(
    "Set-Cookie",
    serializeCookie("token", "", {
      path: "/",
      httpOnly: true,
      sameSite: true,
      secure: true,
      expires: new Date(),
    })
  );
  return { roomId: null };
});
