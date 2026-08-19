import { z } from 'zod';
export const crearBodegaSchema = z.object({
  codigo: z.string().min(2, 'El código debe tener al menos 2 caracteres').max(20, 'Máximo 20 caracteres'),
  nombre: z.string().min(3, 'El nombre es muy corto').max(100, 'Máximo 100 caracteres'),
  tipo: z.string().min(1, 'Seleccione un tipo de bodega'),
});
export type CrearBodegaForm = z.infer<typeof crearBodegaSchema>;
