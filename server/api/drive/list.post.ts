import { SALT } from "~/constants/app";
import { parse as parseCookie } from "cookie";
import drive from "~/server/services/drive";
import Shuttle from "@cch137/utils/shuttle";
import auth from "~/server/services/auth";

export default defineEventHandler(async function (
  event
): Promise<{ error?: string; data: string[] }> {
  const { req, res } = event.node;

  try {
    const roomId = Shuttle.unpackWithHash(
      parseCookie(req.headers.cookie || "")?.token || "",
      "MD5",
      SALT
    );
    if (!auth.isPin(roomId)) throw new Error();
    return { data: drive.fileList(roomId) };
  } catch {
    return { error: "Not joined a room", data: [] };
  }
});
