import { d as defineEventHandler } from '../../../../runtime.mjs';
import { t as troll, S as SALT, P as PIN } from '../../../../_/troll.mjs';
import { parse } from 'cookie';
import { d as drive } from '../../../../_/index.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'url';
import 'mime';
import 'chardet';

const _id_ = defineEventHandler(async function(event) {
  var _a;
  const { req, res } = event.node;
  try {
    const pin = troll.d(((_a = parse(req.headers.cookie || "")) == null ? void 0 : _a.token) || "", 2, SALT);
    if (pin != PIN) {
      res.statusCode = 401;
      return "";
    }
  } catch {
  }
  const fp = decodeURIComponent(req.url || "").split("/").at(-1) || "";
  const fileData = drive.readFile(fp);
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
});

export { _id_ as default };
//# sourceMappingURL=_id_.mjs.map
