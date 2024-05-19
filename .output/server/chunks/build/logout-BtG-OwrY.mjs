import { a as useAuth, c as useTitle, g as appName } from './app-CMCxKW3w.mjs';
import { b as navigateTo } from './server.mjs';
import { defineComponent, useSSRContext } from 'vue';
import '@vueuse/core';
import 'lodash-unified';
import '@vue/shared';
import './index-DGvzZ8bW.mjs';
import '@unhead/shared';
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
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "logout",
  __ssrInlineRender: true,
  setup(__props) {
    const { logout } = useAuth();
    useTitle(`Log Out - ${appName}`);
    logout().finally(() => {
      navigateTo("/");
    });
    return (_ctx, _push, _parent, _attrs) => {
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/logout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=logout-BtG-OwrY.mjs.map
