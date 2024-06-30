import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFormatoKycFileBase64 } from 'src/app/modules/administracion/helpers/interfaces/adm-formato';
import { PaginateParamsGenerator } from 'src/app/shared/helpers/generator/paginate-params.generator';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { ITitular } from '../../administracion/helpers/interfaces/core-titular';
import {
  IArchivoValidacion,
  IFileBase64,
} from '../../administracion/helpers/interfaces/core-validacion-documental';
import { IKycTitularArchivos } from '../pages/core/helpers/interfaces/kyc-titular';

@Injectable({
  providedIn: 'root',
})
export class KycExpedienteDigitalService {
  private readonly apiUrl = `${environment.urlApi}/expedientedigital/archivos`;

  constructor(private http: HttpClient) { }

  find_by_Titular(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string
  ) {
    return this.http.get<IResponse<IArchivoValidacion[]>>(
      `${this.apiUrl}/find-by-titular?pais=${pais}&aseguradora=${aseguradora}&proyecto=${proyecto}&titular=${titular}`
    );
  }

  find_by_titular_paginate(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string,
    folio: string,
    paginateParams: IPaginateParams
  ) {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl
      }/find-by-titular-paginated/${pais}/${aseguradora}/${proyecto}/${titular}?folio=${folio}&${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  check_by_titular(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string
  ) {
    return this.http.get<any>(
      `${this.apiUrl}/check-by-titular?pais=${pais}&aseguradora=${aseguradora}&proyecto=${proyecto}&titular=${titular}`
    );
  }

  getByTitularAndTypeDocument(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string,
    idDocument: string
  ) {
    return this.http.get<IResponse<IKycTitularArchivos[]>>(
      `${this.apiUrl}/getByTitularAndTypeDocument?pais=${pais}&aseguradora=${aseguradora}&proyecto=${proyecto}&titular=${titular}&idDocument=${idDocument}`
    );
  }

  getByArchivo(id: string) {
    return this.http.get<IResponse<IKycTitularArchivos[]>>(
      `${this.apiUrl}/${id}`
    );
  }

  getCatalogsTitulares() {
    return this.http.get<IResponse<Array<ITitular>>>(
      `${this.apiUrl}/expedientedigital/archivos/getAllTitularesSelect`
    );
  }

  getFileBase64ByFileName(
    fileName: string,
    titular: string
  ): Observable<IResponse<IFileBase64>> {
    return this.http.get<IResponse<IFileBase64>>(
      `${this.apiUrl}/download?fileName=${fileName}&titular=${titular}`
    );
  }

  getFileZipBase64(
    folio: string,
    titular: string
  ) {
    return this.http.get<IResponse<IFileBase64>>(
      `${this.apiUrl}/download-zip/${folio}/${titular}`
    );
  }

  deleteFile(id: string): Observable<IResponse<any>> {
    return this.http.delete<IResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // cotejarODescotejarDocumentos(data: IKycCotejo) {
  //   return this.http.post(`${this.apiUrlCotejo}`, data);
  // }

  find_by_titular_cotejo_paginate(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string,
    paginateParams: IPaginateParams
  ) {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl
      }/find-by-titular-cotejo-paginated?pais=${pais}&aseguradora=${aseguradora}&proyecto=${proyecto}&titular=${titular}&${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  getByArchivoCotejadoByBase64(id: string) {
    return this.http.get<IResponse<IFormatoKycFileBase64>>(
      `${this.apiUrl}/find-Cotejo/${id}`
    );
  }

  updateSendFormatosFirmados(documento: string, sendFormatosFirmados: boolean, folio: string) {
    return this.http.put<IResponse<any>>(
      `${this.apiUrl
      }/update-sendFormatosFirmados/${documento}/${sendFormatosFirmados}/${folio}`, {}
    );
  }


  selectSendFormatosFirmados(aseguradora: string, titular: string, folio: string) {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl}/select-sendFormatosFirmados/${aseguradora}/${titular}/${folio}`
    );
  }
}
