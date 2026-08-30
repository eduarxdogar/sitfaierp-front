export interface ProductoResponse {
  productoId: string;
  empresaId: string;
  sku: string;
  nombre: string;
  descripcion?: string;
  categoriaId?: string;
  unidadMedida?: string;
  precioCompra?: number;
  precioVenta?: number;
  impuesto?: number;
  codigoBarras?: string;
  estado: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearProductoRequest {
  sku: string;
  nombre: string;
  descripcion?: string;
  categoriaId?: string;
  unidadMedida?: string;
  precioCompra: number;
  precioVenta: number;
  impuesto?: number;
  codigoBarras?: string;
}