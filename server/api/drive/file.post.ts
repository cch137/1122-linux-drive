import { PIN, SALT } from "~/constants/app";
import { parse as parseCookie } from "cookie";
import drive from "~/server/services/drive";
import Shuttle from "@cch137/utils/shuttle";
import random from "@cch137/utils/random";

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
    if (!pin || !PIN.includes(pin) ) return { error: "Not logged in", data: false };
  } catch {
    return { error: "Not logged in", data: false };
  }

  const files = await readMultipartFormData(event);
  if (files !== undefined) {
    await Promise.all(
      files.map((file) => {
        return drive.writeFile(
          file.filename ||
            `${random.base16(16)}.${(file.type || "").split("/").at(-1)}`,
          file.data
        );
      })
    );
  }
  return { data: true };
});
