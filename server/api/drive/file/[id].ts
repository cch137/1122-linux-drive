import { PIN, SALT } from "~/constants/app";
import { parse as parseCookie } from "cookie";
import drive from "~/server/services/drive";
import Shuttle from "@cch137/utils/shuttle";

export default defineEventHandler(async function (event): Promise<any> {
  const { req, res } = event.node;

  try {
    const pin = Shuttle.unpackWithHash(
      parseCookie(req.headers.cookie || "")?.token || "",
      "MD5",
      SALT
    );
    if (pin != PIN) {
      res.statusCode = 401;
      return "";
    }
  } catch {
    res.statusCode = 401;
    return "";
  }

  const fp: string =
    (decodeURIComponent(req.url || "")
      .split("/")
      .at(-1) as string) || "";
  const fileData = drive.readFile(fp);
  if (!fileData.exists) {
    res.statusCode = 404;
    return fileData.content;
  }
  if (fileData.encoding) {
    res.setHeader(
      "Content-Type",
      `${fileData.mimetype}; charset=${fileData.encoding.toLowerCase()}`
    );
  } else {
    res.setHeader("Content-Type", fileData.mimetype);
  }
  return fileData.content;
});
