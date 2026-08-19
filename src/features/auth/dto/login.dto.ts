import type { BackendModule } from "@shared/types/permissions.types.ts";

/** Información del usuario autenticado devuelta por el backend */
export interface UserInfo {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

/** Respuesta del endpoint POST command/login */
export interface LoginResponse {
  userInfo: UserInfo;
  modules: BackendModule[];
}
