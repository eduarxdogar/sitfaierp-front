import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import keycloak from "@shared/services/auth/keycloak.client.ts";
import { FORCE_LOGIN_STORAGE_KEY } from "@shared/services/auth/session-keys.ts";
import "./style.css";

function getCurrentRedirectUri() {
  return `${window.location.origin}${window.location.pathname}${window.location.search}`;
}

/**
 * Bootstrap asincrono.
 * REGLA: keycloak.init() se resuelve ANTES de createApp().
 * La app Vue NUNCA se monta si el usuario no esta autenticado.
 */
async function bootstrap() {
  const shouldForceLogin =
    sessionStorage.getItem(FORCE_LOGIN_STORAGE_KEY) === "true";
  const currentRedirectUri = getCurrentRedirectUri();

  const authenticated = await keycloak.init({
    onLoad: shouldForceLogin ? "check-sso" : "login-required",
    pkceMethod: "S256",
    checkLoginIframe: false,
    redirectUri: currentRedirectUri,
  });

  if (shouldForceLogin) {
    sessionStorage.removeItem(FORCE_LOGIN_STORAGE_KEY);
    await keycloak.login({
      prompt: "login",
      redirectUri: window.location.origin + "/login",
    });
    return;
  }

  if (!authenticated) {
    await keycloak.login({ redirectUri: currentRedirectUri });
    return;
  }

  const app = createApp(App);
  const pinia = createPinia();

  pinia.use(piniaPluginPersistedstate);

  app.use(pinia);
  app.use(router);
  app.use(VueQueryPlugin);

  app.provide("keycloak", keycloak);

  app.mount("#app");
}

bootstrap();