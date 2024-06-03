import { PIN, SALT } from "~/constants/app";
import { parse as parseCookie } from "cookie";
import drive from "~/server/services/drive";
import Shuttle from "@cch137/utils/shuttle";
import random from "@cch137/utils/random";
import auth from "~/server/services/auth";
import { readMultipartFormData } from "h3";

export default defineEventHandler(async function (
  event
): Promise<{ error?: string; data: boolean }> {
  const { req, res } = event.node;

  let roomId;
  try {
    roomId = Shuttle.unpackWithHash(
      parseCookie(req.headers.cookie || "")?.token || "",
      "MD5",
      SALT
    );
    if (!auth.isPin(roomId)) throw new Error();
  } catch {
    return { error: "Not joined a room", data: false };
  }

  const files = await readMultipartFormData(event);
  if (files !== undefined) {
    await Promise.all(
      files.map((file) => {
        if (file.filename && file.data.length > 0) {
          const filename = file.filename || `${random.base16(16)}.${(file.type || "").split("/").at(-1)}`;
          return drive.writeFile(roomId, filename, file.data);
        }
      })
    );
  }
  return { data: true };
});
