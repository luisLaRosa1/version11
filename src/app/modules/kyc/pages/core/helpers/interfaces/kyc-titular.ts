import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

 
export interface IKycTitular {
    _id: ObjectId;
    proyecto: ObjectId;
    numeroCliente: string;
    nombre?: string;
    primerApellido: string;
    segundoApellido: string;
    tipoPersona: ObjectId;
}

export interface IKycTitularArchivos {
    _id: ObjectId;
    id:string,
    filename:string,
    contentType:string
    url:string,
    version:number,
    eliminado:boolean
}
