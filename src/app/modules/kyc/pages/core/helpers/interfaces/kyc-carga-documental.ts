import { IConfiguracionDocumentalDocumentos } from "../../../../../administracion/helpers/interfaces/adm-configuracion-documental";

export interface IKycArchivo {
    titular: string,
    documento: string,
    aseguradora: string,
    nombreOriginal: string,
    nombreDocumento: string,
    indexDocumento?: number,
    fechaVigencia: Date,
    vigencia:boolean,
    file: File
  }