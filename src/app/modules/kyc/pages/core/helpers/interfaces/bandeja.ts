import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';
import { IKycEjecutivo } from '../../../shared/helpers/interfaces/kyc-ejecutivo.enum';
import { IKycFlujoConsulta } from './kyc-flujo-consulta';

export interface IBandejaPaginate {
  folio: ObjectId;
  folioMultisistema: number;
  folioCodigo: string;
  cliente: string;
  aseguradora: string;
  actividad: string;
  idActividad: number;
  estado: string;
  fechaInicio: string;
  titular: string;
  proyecto: string;
  actividadCodigo: number;
  actividadId: string;
  fechaInicial: string;
  aseguradoraId: string;
  pais: number;
  estatusActividad: number;
  fechaFinal: string;
  flujoConsulta: IKycFlujoConsulta;
  ejecutivo?: IKycEjecutivo;
}
