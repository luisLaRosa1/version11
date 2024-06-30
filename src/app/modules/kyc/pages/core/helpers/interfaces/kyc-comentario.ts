import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

// export interface IKycComentario {
//     _id?: ObjectId;
//     folio: string;
//     actividad: number;
//     comentarios: string;
// }

export interface IKycComentario {
    folio: string;
    bitacora?: ObjectId;
    comentarios: string;
    actividad: number;
    // fecha: Date;
}