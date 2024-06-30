import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';

export interface IFlujoConsulta {
  actividad: KYCEActividad;
  path: string;
  estatus: string;
  nombre: string;
}
