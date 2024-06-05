import { SALT } from "~/constants/app";
import { parse as parseCookie } from "cookie";
import drive from "~/server/services/drive";
import { Shuttle } from "@cch137/utils/shuttle";
import { readBody } from "h3";

export default defineEventHandler(async function (
  event
): Promise<{ error?: string; data: boolean }> {
  const { req, res } = event.node;

  try {
    const roomId = Shuttle.unpackWithHash(
      parseCookie(req.headers.cookie || "")?.token || "",
      "MD5",
      SALT
    ) as string;

    if (!roomId) {
      console.error("Not logged in or invalid PIN:", roomId);
      return { error: "Not logged in", data: false };
    }

    const { fp } = await readBody(event);
    if (fp) {
      try {
        console.log("Attempting to delete file:", fp, "in room:", roomId);
        await drive.deleteFile(roomId, fp);
        console.log("File deletion successful");
        return { data: true };
      } catch (error) {
        console.error("Failed to delete file:", error);
        return { error: "Failed to delete file", data: false };
      }
    } else {
      console.error("Invalid parameters: missing fp");
      return { error: "Invalid parameters", data: false };
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "Not logged in", data: false };
  }
});
