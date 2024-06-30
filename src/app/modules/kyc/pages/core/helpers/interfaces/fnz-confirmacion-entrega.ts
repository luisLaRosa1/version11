import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IKycConfirmacionEntrega {
    folio?: ObjectId;
    entregado: boolean;
    archivos: IKycArchivos[];
  }
  
  export interface IKycArchivos {
    expediente: ObjectId | undefined;
    correcto?: boolean;
    motivo?: ObjectId;
    usuarioAlta: ObjectId | undefined;
    fechaHoraAlta: Date;
  }
  