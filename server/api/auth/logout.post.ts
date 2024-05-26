import { serialize as serializeCookie } from "cookie";

export default defineEventHandler(async function (
  event
): Promise<{ error?: string; isLoggedIn: boolean }> {
  const { req, res } = event.node;

  res.setHeader(
    "Set-Cookie",
    serializeCookie("token", "", {
      path: "/",
      httpOnly: true,
      sameSite: true,
      secure: true,
      expires: new Date(),
    })
  );

  return { isLoggedIn: false };
});
