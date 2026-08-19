import keycloak from "@/shared/services/auth/keycloak.client";
import { useAuthStore } from "@features/auth/store/auth.store.ts";
import { usePermissionsStore } from "@features/auth/store/permissions.store.ts";

export const SESSION_EXPIRED_STORAGE_KEY = "session_expired";

/**
 * Marca la sesión como expirada en sessionStorage.
 * Usado por el Navigation Guard y el HTTP client para señalizar 401.
 */
export function markSessionExpired() {
  sessionStorage.setItem(SESSION_EXPIRED_STORAGE_KEY, "true");
}

/**
 * Obtiene el Access Token vigente, refrescándolo si expira en menos de 30 segundos.
 *
 * @returns El token JWT como string, o null si no se pudo obtener.
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    await keycloak.updateToken(30);
    return keycloak.token ?? null;
  } catch {
    // El refresh token también expiró; el caller maneja el error
    return null;
  }
}

/**
 * Limpia completamente la sesión del usuario:
 * 1. Resetea el store de permisos
 * 2. Resetea el store de autenticación
 * 3. Redirige al login de Keycloak
 */
export async function clearAuthSession() {
  const auth = useAuthStore();
  const permissions = usePermissionsStore();

  permissions.clearPermissions();
  auth.clearAuth();

  await keycloak.logout({
    redirectUri: window.location.origin,
  });
}
