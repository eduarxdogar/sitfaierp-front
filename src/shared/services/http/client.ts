import type { HttpError, HttpRequestConfig } from "./types";
import { clearAuthSession, markSessionExpired } from "@shared/services/token.service.ts";
import { buildUrl } from "@shared/services/http/build-url.ts";
import keycloak from "@shared/services/auth/keycloak.client.ts";

export async function httpClient<
  TResponse,
  TBody = unknown,
  TParams extends object | undefined = undefined,
>(config: HttpRequestConfig<TBody, TParams>): Promise<TResponse> {
  const { url, method = "GET", body, params, headers } = config;

  // Intentar obtener el token actual de Keycloak y refrescarlo si es necesario
  let token = '';
  try {
      if (keycloak && keycloak.authenticated) {
          await keycloak.updateToken(30); // Refresca si expira en menos de 30s
          token = keycloak.token || '';
      }
  } catch (err) {
      console.error('Error al actualizar el token de Keycloak:', err);
  }

  console.log('🔑 Token JWT adjuntado a la petición:', token ? 'Token presente (Bearer ...)' : '❌ TOKEN VACÍO');

  const endpoint = buildUrl(url, params);
  const finalHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...headers,
  };

  console.group('🌐 [HTTP Client Audit]');
  console.log('URL:', endpoint);
  console.log('Method:', method);
  console.log('Headers:', finalHeaders);
  console.log('Body:', body);
  console.groupEnd();

  const res = await fetch(endpoint, {
    method,
    credentials: "include",
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  console.log(`📥 Respuesta recibida de ${endpoint} -> Status: ${res.status}`);

  if (res.status === 204) return {} as TResponse;

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok || (json && json.success === false)) {
    if (res.status === 401) {
      markSessionExpired();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await clearAuthSession();
    }
    
    // Capturar mensaje que envíe el backend de Spring Boot
    const errMsg = json?.message || json?.detail || json?.error || `HTTP Error: ${res.status}`;
    
    throw {
      status: res.status,
      message: errMsg,
      data: json,
    } satisfies HttpError;
  }

  if (!json) throw { status: res.status, message: "Empty response body" };

  return json.data !== undefined ? json.data : json;
}