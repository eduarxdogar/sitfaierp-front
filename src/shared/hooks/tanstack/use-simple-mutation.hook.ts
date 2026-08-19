import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";
import { httpClient } from "@/shared/services/http/client";
import type {
  ApiErrorResponse,
  HttpMethod,
} from "@/shared/services/http/types";

/**
 * Hook de TanStack Query para mutaciones (POST/PUT/PATCH/DELETE).
 *
 * Prefija automáticamente la URL con "command/" (patrón CQRS del backend).
 * Maneja errores HTTP automáticamente mostrando mensajes del backend.
 *
 * @param url     Endpoint relativo sin prefijo (ej: "users/create")
 * @param method  Método HTTP (default: "POST")
 * @param options Opciones de useMutation (onSuccess, etc.)
 * @param service Microservicio destino (default: "coreapi")
 *
 * Uso:
 *   const { mutate, isPending } = useSimpleMutationHook<UserResponse, CreateUserBody>(
 *     "users/create"
 *   );
 *   mutate(body, { onSuccess: (data) => { ... } });
 */
export function useSimpleMutationHook<TResponse, TBody = any>(
  url: string | ((variables: TBody) => string),
  method: HttpMethod = "POST",
  options?: UseMutationOptions<TResponse, Error, TBody, unknown>,
  service?: string,
) {
  return useMutation<TResponse, Error, TBody>({
    mutationFn: (body: TBody) => {
      const resolvedUrl = typeof url === 'function' ? url(body) : url;
      return httpClient<TResponse, TBody>({
        url: resolvedUrl,
        method,
        body,
        service,
      });
    },
    onError: (error) => {
      const ApiError = error as unknown as ApiErrorResponse;

      // El error 401 ya fue manejado por el httpClient (logout automático)
      if (ApiError.status === 401) return;

      console.error("[Mutation Error]", ApiError);
    },

    ...options,
  });
}
