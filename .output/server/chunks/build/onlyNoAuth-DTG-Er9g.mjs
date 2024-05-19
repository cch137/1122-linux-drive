import { g as defineNuxtRouteMiddleware } from './server.mjs';
import 'vue';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue/server-renderer';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vue/shared';
import '@vueuse/core';

const onlyNoAuth = defineNuxtRouteMiddleware(async (to, from) => {
});

export { onlyNoAuth as default };
//# sourceMappingURL=onlyNoAuth-DTG-Er9g.mjs.map
