import { d as defineEventHandler } from '../../../runtime.mjs';
import { t as troll, S as SALT, P as PIN } from '../../../_/troll.mjs';
import { parse } from 'cookie';
import { d as drive } from '../../../_/index.mjs';
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

const list_post = defineEventHandler(async function(event) {
  var _a;
  const { req, res } = event.node;
  try {
    const pin = troll.d(((_a = parse(req.headers.cookie || "")) == null ? void 0 : _a.token) || "", 2, SALT);
    if (pin != PIN) {
      return { error: "Not logged in.", data: [] };
    }
  } catch {
  }
  return { data: drive.fileList() };
});

export { list_post as default };
//# sourceMappingURL=list.post.mjs.map
