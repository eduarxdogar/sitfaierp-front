import { z } from 'zod';

export const crearProductoSchema = z.object({
  sku: z.string().min(1, 'El SKU es obligatorio'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional(),
  categoriaId: z.string().optional(),
  unidadMedida: z.string().optional(),
  precioCompra: z.number().min(0, 'El precio no puede ser negativo'),
  precioVenta: z.number().min(0, 'El precio no puede ser negativo'),
  impuesto: z.number().optional(),
  codigoBarras: z.string().optional(),
});

export type CrearProductoForm = z.infer<typeof crearProductoSchema>;