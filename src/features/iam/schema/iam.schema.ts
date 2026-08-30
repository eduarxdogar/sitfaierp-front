// ─────────────────────────────────────────────────────────────────────────────
// IAM Schema — validación Zod de CrearUsuarioRequest
// ─────────────────────────────────────────────────────────────────────────────
import { z } from 'zod';

export const estadoUsuarioSchema = z.enum(['ACTIVO', 'INACTIVO', 'BLOQUEADO', 'INVITADO']);

export const crearUsuarioSchema = z.object({
  nombreCompleto: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),

  username: z
    .string()
    .min(4, 'El username debe tener al menos 4 caracteres')
    .max(30, 'El username no puede superar 30 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Solo letras, números, puntos, guiones y guiones bajos'),

  email: z
    .string()
    .email('Ingrese un correo electrónico válido'),

  rolId: z
    .string()
    .min(1, 'Debe asignar un rol al usuario'),

  empresa: z
    .string()
    .min(2, 'La empresa es requerida'),

  empresa_id: z
    .string()
    .min(1, 'El ID de empresa es requerido'),

  sucursal: z.string().optional(),

  estado: estadoUsuarioSchema.default('ACTIVO'),

  enviarInvitacion: z.boolean().default(true),
});

export type CrearUsuarioForm = z.infer<typeof crearUsuarioSchema>;
