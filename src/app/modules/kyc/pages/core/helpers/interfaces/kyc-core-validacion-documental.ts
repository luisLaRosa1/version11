import { ICatalogo } from "src/app/modules/catalogos/helpers/interfaces/catalogo";
import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IKycArchivoValidacion {
  id: ObjectId;
  documento: string;
  url: string;
  motivos: ICatalogo[];
  vigencia?: boolean;
  fechaVigencia: string;
  correcto: boolean;
  documento_id?:ObjectId;
  idMotivo?: number;
  categoria: number;
  clave: string;

}

export interface IKycArchivoComplementarios {
  id: ObjectId;
  documento: string;
  url: string;
}


//ajustes 
export interface IKycValidacionDigital {
  _id?: ObjectId;
  folio?: ObjectId;
  apoderado?:string;
  pais?:number;
  tipoPersona?:ObjectId;
  archivoFic?: ObjectId;
  archivoAnexo?: ObjectId;
  archivos?: any[]
  isListaNegra?: boolean;
  paisDescripcion?:string
}

export interface IKycValidacionDigitalArchivos {
  documento: number;
  correcto: boolean;
  motivo: number;
}

export interface IValidacionDigitalEdit {
  documentos: Array<IKycValidacionDigital>;
  catalogos: IKycValidacionDigitalCatalogs;
}

export interface IKycValidacionDigitalCatalogs {
  motivos: Array<ICatalogo>;
}

export interface IValidacionDigitalArchivos {
  expediente?: ObjectId;
  documento: ObjectId;
  motivo?: number;
  vigencia?:boolean;
  correcto?: boolean;
  url?: string;
  fechaVigencia?:Date
}


export interface IKycApoderado {
  apoderado?:string;
  pais?:number;
  paisDescripcion?:string
}
