import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { IValidacionFirmasArchivos } from 'src/app/modules/kyc/pages/core/helpers/interfaces/kyc-core-validacion-firmas';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface IArchivoValidacion {
  id: ObjectId;
  documento: string;
  url: string;
  motivos: ICatalogo[];
  vigencia?: boolean;
  fechaVigencia: string;
  correcto: boolean;
  idMotivo?: number;
  categoria: number;
  clave: string;
}

export interface IArchivoComplementarios {
  id: ObjectId;
  documento: string;
  url: string;
}

//ajustes
export interface IValidacionDigital {
  folio?: ObjectId;
  archivos?: any[];
}

export interface IValidacionDigitalArchivos {
  documento: number;
  correcto: boolean;
  motivo: number;
}

export interface IValidacionDigitalEdit {
  documentos: Array<IValidacionDigital>;
  catalogos: IValidacionDigitalCatalogs;
}

export interface IValidacionDigitalCatalogs {
  motivos: Array<ICatalogo>;
}

export interface IFileBase64 {
  base64: string;
  contenType: string;
}

export interface CountryType {
  _id: string;
  clave: number;
  descripcion: string;
  abreviatura: string;
  icon: string;
  activo: boolean;
}

export interface ApoderadoType {
  // _id: string;
  apoderado: string;
  selectPais:number;
  contribuyente:string;
}

export interface validacionType{
  folio?: ObjectId;
  archivos?: Array<IValidacionFirmasArchivos>;
}