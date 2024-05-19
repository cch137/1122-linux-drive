import url from 'url';
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import chardet from 'chardet';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesDirPath = path.join(__dirname, './files');

function makeDir() {
  try {
    fs.mkdirSync(filesDirPath, { recursive: true });
  } catch {}
}

makeDir();

const eventTarget = new EventTarget();

export default {
  eventTarget,

  fileList() {
    return fs.readdirSync(filesDirPath);
  },

  readFile(fp: string) {
    fp = path.join(filesDirPath, `./${fp}`);
    const exists = fs.existsSync(fp);
    const content = exists ? fs.readFileSync(fp) : Buffer.from('');
    const mimetype = exists ? mime.getType(fp) || 'application' : '';
    const encoding = mimetype.startsWith('text') ? chardet.detect(content) : undefined;
    return { exists, content, mimetype, encoding };
  },

  async writeFile(fp: string, content: Buffer) {
    eventTarget.dispatchEvent(new Event('change'));
    fp = path.join(filesDirPath, `./${fp}`);
    return new Promise((resolve, reject) => fs.writeFile(fp, content, {}, (err) => {
      if (err) return reject(err);
      resolve(null);
    }));
  },

  async deleteFile(fp: string) {
    eventTarget.dispatchEvent(new Event('change'));
    fp = path.join(filesDirPath, `./${fp}`);
    return new Promise((resolve, reject) => fs.rm(fp, (err) => {
      if (err) return reject(err);
      resolve(null);
    }));
  }
}
