<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@features/auth/store/auth.store";
import keycloak from "@shared/services/auth/keycloak.client";

const router = useRouter();
const authStore = useAuthStore();
const loadingMessage = ref("Validando...");

onMounted(() => {
  if (keycloak.authenticated && keycloak.tokenParsed) {
    const parsed = keycloak.tokenParsed;
    
    authStore.setUserInfo({
      userId: parsed.sub || "",
      email: parsed.email || "",
      firstName: parsed.given_name || "",
      lastName: parsed.family_name || "",
      fullName: parsed.name || ""
    });
    
    authStore.isAuthenticated = true;
    router.push("/dashboard");
  } else {
    loadingMessage.value = "Redirigiendo al inicio de sesión...";
    keycloak.login({
      redirectUri: window.location.origin + "/login"
    });
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="w-4/5 md:max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
      <div class="mb-4">
        <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
      <span class="block mt-4 text-sm text-gray-500">
        {{ loadingMessage }}
      </span>
    </div>
  </div>
</template>