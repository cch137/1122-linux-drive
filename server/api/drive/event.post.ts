import { PIN, SALT } from "~/constants/app";
import { parse as parseCookie } from "cookie";
import drive from "~/server/services/drive";
import Shuttle from "@cch137/utils/shuttle";
import auth from "~/server/services/auth";

export default defineEventHandler(async function (event) {
  const { req, res } = event.node;

  try {
    const roomId = Shuttle.unpackWithHash(
      parseCookie(req.headers.cookie || "")?.token || "",
      "MD5",
      SALT
    );
    if (!auth.isPin(roomId)) return;
  } catch {}

  res.writeHead(200, "OK", {
    "Content-Type": "text/event-stream",
    "Transfer-Encoding": "chunked",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const driveOnchange = () => res.write("1");
  drive.eventTarget.addEventListener("change", driveOnchange);
  setTimeout(() => {
    res.end();
    drive.eventTarget.removeEventListener("change", driveOnchange);
  }, 60 * 1000);

  return;
});
