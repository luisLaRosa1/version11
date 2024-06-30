import { ObjectId } from "src/app/shared/helpers/types/objectid.type";
import { IKycFlujoConsulta } from "./kyc-flujo-consulta";

export interface IKycBitacoraDetalle {
    folio: ObjectId;
    actividad: number;
    usuario: string;
    estatusBitacora:string;
    fecha:Date;
    _id:string;
}
  
  
  export interface IKycBitacora {
    folio: ObjectId;
    actividad: number;
    usuario: string;
    estatusBitacora:string;
  }
