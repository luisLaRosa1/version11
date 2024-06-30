import { ICatalogo } from "src/app/modules/catalogos/helpers/interfaces/catalogo";
import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

//ajustes 
export interface IKycFirmaEjecutivo {
  _id?: ObjectId;
  folio?: ObjectId;
  archivos?: any[];
  archivosClasificacion?: Array<IKycArchivosClasificacion>
}

export interface IKycArchivosClasificacion {
  expediente?: ObjectId;
  documento?: ObjectId;
}
