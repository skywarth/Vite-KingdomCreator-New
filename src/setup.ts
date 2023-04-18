import { createApp } from "vue";
import { i18n } from "./i18n/i18n";
import type { Router } from "vue-router";
import { createPinia } from "pinia";
import { useWindowStore } from "./pinia/window-store";

export function initialize<S>(router: Router) {
  const app = createApp({
    template: `
      <div id="app">
        <router-view></router-view>
      </div>
    `
  });
  app.use(i18n);
  app.use(router);
  app.use(createPinia());
  initializeWindowListener();
  app.mount('#app');
};

function initializeWindowListener () {
  window.addEventListener("resize", () => {
    updateWindowSize();
  });
  updateWindowSize();   
};

function updateWindowSize () {
  const WindowStore = useWindowStore();
  WindowStore.updateWindowWidth(window.outerWidth);
};
