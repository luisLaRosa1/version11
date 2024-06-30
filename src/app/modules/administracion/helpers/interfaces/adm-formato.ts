import { IDocumento } from 'src/app/modules/administracion/helpers/interfaces/adm-documento';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface IFormatoKycPaginate {
  _id: ObjectId;
  proyecto: string;
  idProyecto: string;
  idAseguradora: string;
  aseguradora: string;
  documento: string;
  tipoPersona: string;
  pais: string;
  abreviatura: string;
  nombre: string;
  path: string;
}

export interface IFormatoKYC {
  nombre: string;
  path: string;
  pais: number;
  proyecto: ObjectId;
  aseguradora: ObjectId;
  documento: ObjectId;
  tipoPersona: Array<number>;
}

export interface IFormatoKycEdit {
  formatoKyc: IFormatoKYC;
  catalogos: IFormatoKycCatalogs;
}

export interface IFormatoKycCatalogs {
  paises: Array<ICatalogoPais>;
  aseguradora: Array<IAseguradoraCatalog>;
  proyecto: Array<IProyectoCatalog>;
  tipoPersona: Array<ICatalogo>;
  documento: Array<IDocumento>;
}

export interface IProyectoCatalog {
  _id: ObjectId;
  pais: number;
  estatus: number;
  aseguradora: ObjectId;
  proceso: number;
  negocio: number;
  ramo: number;
  ceco: string;
  codigo: string;
}

export interface IAseguradoraCatalog {
  _id: ObjectId;
  razonSocial: string;
  nombreComercial: string;
  pais: number;
  estatus: number;
  altaConfiguracionDocumental: boolean;
  documentos: boolean;
}

export interface IFormatoKycDelete {
  _id: string;
  nombre: string;
  idAseguradora: string;
  idProyecto: string;
}

export interface IFormatoKycFileBase64 {
  base64: string;
  contentType: string;
}
