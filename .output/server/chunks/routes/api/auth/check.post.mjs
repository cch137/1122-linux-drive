import { d as defineEventHandler } from '../../../runtime.mjs';
import { t as troll, S as SALT, P as PIN } from '../../../_/troll.mjs';
import { parse, serialize } from 'cookie';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';

const check_post = defineEventHandler(async function(event) {
  var _a;
  const { req, res } = event.node;
  try {
    const pin = troll.d(((_a = parse(req.headers.cookie || "")) == null ? void 0 : _a.token) || "", 2, SALT);
    if (pin == PIN) {
      return { isLoggedIn: true };
    }
  } catch {
  }
  res.setHeader("Set-Cookie", serialize("token", "", {
    path: "/",
    httpOnly: true,
    sameSite: true,
    secure: true,
    expires: /* @__PURE__ */ new Date()
  }));
  return { isLoggedIn: false, error: "Not logged in." };
});

export { check_post as default };
//# sourceMappingURL=check.post.mjs.map
