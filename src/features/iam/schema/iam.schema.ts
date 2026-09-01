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

  sucursalId: z.string().optional(),

  estado: estadoUsuarioSchema.default('ACTIVO'),

  enviarInvitacion: z.boolean().default(true),
});

export type CrearUsuarioForm = z.infer<typeof crearUsuarioSchema>;

export const crearRolSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(50, 'Máximo 50 caracteres'),
  codigo: z.string().min(3, 'El código debe tener al menos 3 caracteres').max(30, 'Máximo 30 caracteres').regex(/^[A-Z0-9_]+$/, 'Solo mayúsculas, números y guiones bajos'),
  descripcion: z.string().max(255, 'La descripción es muy larga').optional(),
});

export type CrearRolForm = z.infer<typeof crearRolSchema>;
