import { ICatalogo } from "src/app/modules/catalogos/helpers/interfaces/catalogo";
import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export class IKycCotejo {
    id: ObjectId = "";
    usuario: ObjectId = "";
    numeroCliente: string = "";
    pathFirma: string = "";
    documentos: Array<Documentos> = []
}

export class Documentos {
    id: ObjectId = "";
    filename: string = "";
    cotejar: boolean = false;
}

export interface IKycArchivoCotejo {
    id: ObjectId;
    documento: string;
    url: string;
    nombreCorto: string;
    fechaAlta: string;
    peso: string;
    changeCotejado: boolean;
    cotejado: Cotejado | undefined
}

export interface Cotejado {
    usuario: ObjectId;
    path: string;
    fechaCreacion: string;
}
