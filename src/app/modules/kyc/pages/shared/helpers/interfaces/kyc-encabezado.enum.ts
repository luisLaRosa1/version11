export interface IKycEncabezado {
  folioCliente: string;
  aseguradora: string;
  asegurado: string;
  fechaVigencia: Date;
  unidad: string;
  tipoMovimiento: string;
  riesgo: string;
  estatusBitacora: string;
  pais?: string;
  tipoPersona?: number;
}
