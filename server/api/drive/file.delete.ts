import { PIN, SALT } from "~/constants/app";
import { parse as parseCookie } from "cookie";
import drive from "~/server/services/drive";
import Shuttle from "@cch137/utils/shuttle";
import { readBody } from "h3";

export default defineEventHandler(async function (
  event
): Promise<{ error?: string; data: boolean }> {
  const { req, res } = event.node;

  try {
    const pin = Shuttle.unpackWithHash(
      parseCookie(req.headers.cookie || "")?.token || "",
      "MD5",
      SALT
    )as string;
    if (!pin || !PIN.includes(pin)) return { error: "Not logged in", data: false };
  } catch {
    return { error: "Not logged in", data: false };
  }

  const fp = (await readBody(event))?.fp;
  if (fp) await drive.deleteFile(fp);
  return { data: true };
});
