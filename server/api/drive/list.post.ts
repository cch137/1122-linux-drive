import { PIN, SALT } from "~/constants/app";
import { parse as parseCookie } from "cookie";
import drive from "~/server/services/drive";
import Shuttle from "@cch137/utils/shuttle";

export default defineEventHandler(async function (
  event
): Promise<{ error?: string; data: string[] }> {
  const { req, res } = event.node;

  try {
    const pin = Shuttle.unpackWithHash(
      parseCookie(req.headers.cookie || "")?.token || "",
      "MD5",
      SALT
    )as string;
    if (!pin || !PIN.includes(pin)) return { error: "Not logged in", data: [] };
  } catch {
    return { error: "Not logged in", data: [] };
  }

  return { data: drive.fileList() };
});
