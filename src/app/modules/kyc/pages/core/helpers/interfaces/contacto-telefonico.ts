import { ICatalogo } from "src/app/modules/catalogos/helpers/interfaces/catalogo";
import { ObjectId } from "src/app/shared/helpers/types/objectid.type";


export interface ICatalogos {

    tipoLlamada: Array<ICatalogo>;
    estatus: Array<ICatalogo>;
    tipoContacto: Array<ICatalogo>;
}

export interface IContactoTelefonico {
    folio: ObjectId;
    usuario?: ObjectId;
    tipoLlamada: number;
    estatus: number;
    observaciones: string;
}

export interface IContactoTelefonicoPaginate {
    fechaContacto: string;
    usuario: string;
    tipoLlamada: string;
    estatus: string;
    fechaProximaLlamada: string;
    observaciones: string;
}

export interface InformacionTelefonicaDto {
    folio: ObjectId;
    telefono: string;
    extensiones: string[];
}

export interface InformacionContactoDto {
    _id?: string;
    folio: ObjectId;
    nombre: string;
    tipo: number;
    correos: string[];
}

