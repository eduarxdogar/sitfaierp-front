import { z } from 'zod';

export const crearEmpresaSchema = z.object({
  ruc: z.string().regex(/^\d{11}$/, 'El RUC debe contener exactamente 11 dígitos numéricos'),
  razonSocial: z.string().min(3, 'La Razón Social es muy corta').max(100, 'Máximo 100 caracteres'),
});

export type CrearEmpresaForm = z.infer<typeof crearEmpresaSchema>;
