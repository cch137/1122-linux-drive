import { PIN, SALT } from "~/constants/app";
import { parse as parseCookie } from "cookie";
import drive from "~/server/services/drive";
import Shuttle from "@cch137/utils/shuttle";

export default defineEventHandler(async function (event): Promise<any> {
  const { req, res } = event.node;

  try {
    const roomId = Shuttle.unpackWithHash(parseCookie(req.headers.cookie || "")?.token || "", "MD5", SALT) as string;

    if (!roomId) {
      res.statusCode = 401;
      return "";
    }

    const fp: string = (decodeURIComponent(req.url || "").split("/").at(-1) as string) || "";
    const fileData = drive.readFile(roomId, fp); // 确保传入了 roomId 和 fp

    if (!fileData.exists) {
      res.statusCode = 404;
      return fileData.content;
    }
    if (fileData.encoding) {
      res.setHeader("Content-Type", `${fileData.mimetype}; charset=${fileData.encoding.toLowerCase()}`);
    } else {
      res.setHeader("Content-Type", fileData.mimetype);
    }
    return fileData.content;
  } catch {
    res.statusCode = 401;
    return "";
  }
});
