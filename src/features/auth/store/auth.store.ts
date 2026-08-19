import { defineStore } from "pinia";
import keycloak from "@/shared/services/auth/keycloak.client";
import type { BackendModule } from "@shared/types/permissions.types.ts";
import type { UserInfo } from "@features/auth/dto/login.dto.ts";

interface AuthState {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  modules: BackendModule[];
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    isAuthenticated: false,
    userInfo: null,
    modules: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    currentUser: (state) => state.userInfo,
    userRoles: () => keycloak.realmAccess?.roles || [],
    hasRole: () => (roleName: string): boolean =>
        keycloak.realmAccess?.roles.includes(roleName) || false,
  },

  actions: {
    initFromKeycloak() {
      this.isAuthenticated = keycloak.authenticated ?? false;
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },

    async login() {
      await keycloak.login({
        redirectUri: window.location.origin + "/login",
      });
    },

    async logout() {
      this.isLoading = true;
      try {
        this.$reset();
        sessionStorage.clear();
        localStorage.clear();
        
        await keycloak.logout({
          redirectUri: window.location.origin,
        });
      } catch (error) {
        console.error("Error al cerrar sesión", error);
      } finally {
        this.isLoading = false;
      }
    },

    clearAuth() {
      this.isAuthenticated = false;
      this.userInfo = null;
      this.modules = [];
      this.error = null;
      this.isLoading = false;
    },
  },

  persist: {
    key: "auth",
    storage: localStorage,
    pick: ["isAuthenticated", "userInfo"],
  },
});