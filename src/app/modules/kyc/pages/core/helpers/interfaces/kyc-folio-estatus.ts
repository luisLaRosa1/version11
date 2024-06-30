import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface IKycFolioEstatusPaginate {
  _id: ObjectId;
  filename: string;
  archivoSize: number;
  totalRows: number;
  fechaInicioCarga: Date;
  fechaFinCarga: Date;
  correcto: boolean;
  procesado: boolean;
}

export interface IFolioLayoutDetailColumn {
  rowIndex: number;
  //columnIndex: number;
  columnName: string;
  //success: boolean;
  //type: number;
  message: string;
  //value?: string;
}

export interface IFolioLayoutDetail {
  _id: string;
  block: number;
  rowIndex: number;
  success: boolean;
  message: string;
  columns: Array<IFolioLayoutDetailColumn>;
}

export interface IFolioLayoutHeader {
  _id: ObjectId;
  filename: string;
  correcto: boolean;
  archivoSize: number;
  totalRows: number;
  fechaInicioCarga: Date;
  fechaFinCarga: Date;
}

export interface IFolioLayout {
  header: IFolioLayoutHeader;
  details: IPaginate<IFolioLayoutDetail>;
}
