import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface IListaNegraPaginate {
    folio: ObjectId;
    folioCodigo: string;
    folioMultisistema: number;
    nombre: string;
    tipoPersona: string;
    pais: string;
    changeAutorizar: boolean;
}


export class CreateFoliosAutorizadosDto {
    folios: Array<Folio> = [];
}

export class Folio {
    folio: ObjectId = "";
    folioCliente: string = "";
    autorizado: boolean = false;
    folioMultisistema: number = 0
}

