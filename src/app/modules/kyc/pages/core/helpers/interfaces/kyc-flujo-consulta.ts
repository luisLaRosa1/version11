import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';
import { EKycEstatusActividad } from 'src/app/modules/administracion/helpers/enums/kyc-estatus-actividad.enum';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface IKycFlujoConsulta {
  folio: ObjectId;
  actividadActual: KYCEActividad;
  actividadActualEstatus: EKycEstatusActividad;
  ultimaActividadActual: KYCEActividad;
  ultimaActividadEstatus: EKycEstatusActividad;
  actividadContactoTelefonico: KYCEActividad | undefined;
  actividadContactoTelefonicoEstatus: EKycEstatusActividad | undefined;
  actividadContactoAseguradora: KYCEActividad | undefined;
  actividadContactoAseguradoraEstatus: EKycEstatusActividad | undefined;
}
