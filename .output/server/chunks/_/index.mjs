import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import require$$7 from 'url';
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import chardet from 'chardet';

const __filename = require$$7.fileURLToPath(globalThis._importMeta_.url);
const __dirname = path.dirname(__filename);
const filesDirPath = path.join(__dirname, "./files");
function makeDir() {
  try {
    fs.mkdirSync(filesDirPath, { recursive: true });
  } catch {
  }
}
makeDir();
const eventTarget = new EventTarget();
const drive = {
  eventTarget,
  fileList() {
    return fs.readdirSync(filesDirPath);
  },
  readFile(fp) {
    fp = path.join(filesDirPath, `./${fp}`);
    const exists = fs.existsSync(fp);
    const content = exists ? fs.readFileSync(fp) : Buffer.from("");
    const mimetype = exists ? mime.getType(fp) || "application" : "";
    const encoding = mimetype.startsWith("text") ? chardet.detect(content) : void 0;
    return { exists, content, mimetype, encoding };
  },
  async writeFile(fp, content) {
    eventTarget.dispatchEvent(new Event("change"));
    fp = path.join(filesDirPath, `./${fp}`);
    return new Promise((resolve, reject) => fs.writeFile(fp, content, {}, (err) => {
      if (err)
        return reject(err);
      resolve(null);
    }));
  },
  async deleteFile(fp) {
    eventTarget.dispatchEvent(new Event("change"));
    fp = path.join(filesDirPath, `./${fp}`);
    return new Promise((resolve, reject) => fs.rm(fp, (err) => {
      if (err)
        return reject(err);
      resolve(null);
    }));
  }
};

export { drive as d };
//# sourceMappingURL=index.mjs.map
