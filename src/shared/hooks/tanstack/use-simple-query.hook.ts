import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
} from "@tanstack/vue-query";
import { httpClient } from "@/shared/services/http/client";
import { computed, toValue } from "vue";

/**
 * Hook de TanStack Query para peticiones GET con caché automático.
 *
 * Prefija automáticamente la URL con "query/" (patrón CQRS del backend).
 *
 * @param url       Endpoint relativo sin prefijo (ej: "users/list")
 * @param queryKey  Clave de caché reactiva (string[], ref, computed)
 * @param params    Query params opcionales (reactivos)
 * @param options   Opciones de useQuery (staleTime, enabled, etc.)
 * @param service   Microservicio destino (default: "coreapi")
 * @param context   Contexto CQRS (default: "cqrs")
 *
 * Uso:
 *   const { data, isLoading, error } = useSimpleQueryHook<User[]>(
 *     "users/list",
 *     ["users"],
 *     computed(() => ({ page: currentPage.value }))
 *   );
 */
export function useSimpleQueryHook<
  TResponse,
  TParams extends object | undefined = any,
>(
  url: string,
  queryKey: any[],
  params?: TParams,
  options?: Omit<
    UseQueryOptions<TResponse, Error, TResponse, QueryKey>,
    "queryKey" | "queryFn"
  >,
  service?: string,
  context?: string,
) {
  const resolvedQueryKey = computed(() => toValue(queryKey));
  const resolvedParams = computed(() => toValue(params));

  return useQuery({
    queryKey: resolvedQueryKey,
    queryFn: () =>
      httpClient<TResponse, unknown, TParams>({
        url,
        method: "GET",
        params: resolvedParams.value,
        service,
        context,
      }),
    ...options,
  });
}
