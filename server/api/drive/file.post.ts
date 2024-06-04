import { SALT } from "~/constants/app";
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

  let roomId: unknown;
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
  const overwrite = files?.find(file => file.name === 'overwrite')?.data.toString() === 'true';

  if (files !== undefined) {
    await Promise.all(
      files.map(async (file) => {
        if (file.filename && file.data.length > 0) {
          let filename = file.filename || `${random.base16(16)}.${(file.type || "").split("/").at(-1)}`;
          if (!overwrite) {
            filename = await getUniqueFileName(filename, roomId as string);
          }
          return drive.writeFile(roomId as string, filename, file.data);
        }
      })
    );
  }
  return { data: true };
});

const getUniqueFileName = async (filename:string, roomId:string) => {
  const name = filename.substring(0, filename.lastIndexOf('.'));
  const extension = filename.substring(filename.lastIndexOf('.'));
  let newName = filename;
  let index = 1;
  const existingFiles = await drive.fileList(roomId);

  while (existingFiles.includes(newName)) {
    newName = `${name}(${index})${extension}`;
    index++;
  }

  return newName;
};
