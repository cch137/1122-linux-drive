import fs from "fs";
import path from "path";
import mime from "mime";
import chardet from "chardet";
import { filesDirPath } from "../constants";

const eventTarget = new EventTarget();

export default {
  eventTarget,

  fileList(roomId: string) {
    const roomPath = path.join(filesDirPath, roomId);
    if (!fs.existsSync(roomPath)) {
      return [];
    }
    return fs.readdirSync(roomPath);
  },

  readFile(roomId: string, fp: string) {
    const roomPath = path.join(filesDirPath, roomId);
    fp = path.join(roomPath, `./${fp}`);
    const exists = fs.existsSync(fp);
    const content = exists ? fs.readFileSync(fp) : Buffer.from("");
    const mimetype = exists ? mime.getType(fp) || "application" : "";
    const encoding = mimetype.startsWith("text") ? chardet.detect(content) : undefined;
    return { exists, content, mimetype, encoding };
  },

  async writeFile(roomId: string, fp: string, content: Buffer) {
    const roomPath = path.join(filesDirPath, roomId);
    if (!fs.existsSync(roomPath)) {
      fs.mkdirSync(roomPath, { recursive: true });
    }
    const filePath = path.join(roomPath, `./${fp}`);
    console.log('Writing file at path:', filePath);
    eventTarget.dispatchEvent(new Event("change"));
    return new Promise((resolve, reject) =>
      fs.writeFile(filePath, content, {}, (err) => {
        if (err) {
          console.error('Failed to write file:', err);
          return reject(err);
        }
        resolve(null);
      })
    );
  },

  async deleteFile(roomId: string, fp: string) {
    const roomPath = path.join(filesDirPath, roomId);
    const filePath = path.join(roomPath, `./${fp}`);
    console.log('Deleting file at path:', filePath);
    eventTarget.dispatchEvent(new Event("change"));
    return new Promise((resolve, reject) =>
      fs.rm(filePath, (err) => {
        if (err) {
          console.error('Failed to remove file:', err);
          return reject(err);
        }
        resolve(null);
      })
    );
  },
};
