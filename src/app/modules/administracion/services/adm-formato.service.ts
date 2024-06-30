import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginateParamsGenerator } from 'src/app/shared/helpers/generator/paginate-params.generator';
import {
  IPaginate,
  IPaginateParams,
} from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';
import { environment } from 'src/environments/environment';
import {
  IFormatoKYC,
  IFormatoKycCatalogs,
  IFormatoKycDelete,
  IFormatoKycEdit,
  IFormatoKycFileBase64,
  IFormatoKycPaginate,
} from '../helpers/interfaces/adm-formato';

@Injectable({
  providedIn: 'root',
})
export class AdmFormatoKycService {
  readonly apiUrl = `${environment.urlApi}/administracion`;

  constructor(private http: HttpClient) {}

  paginateAll(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IFormatoKycPaginate>>> {
    return this.http.get<IResponse<IPaginate<IFormatoKycPaginate>>>(
      `${this.apiUrl}/formato-kyc/paginate?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  create(formData: FormData): Observable<IResponse<IFormatoKYC>> {
    return this.http.post<IResponse<IFormatoKYC>>(
      `${this.apiUrl}/formato-kyc`,
      formData
    );
  }

  getByIdAndGetCatalogosToEdit(
    _id: string
  ): Observable<IResponse<IFormatoKycEdit>> {
    return this.http.get<IResponse<IFormatoKycEdit>>(
      `${this.apiUrl}/formato-kyc/find-one-detail/${_id}`
    );
  }

  getCatalogs(word:string | null = ''): Observable<IResponse<IFormatoKycCatalogs>> {
    return this.http.get<IResponse<IFormatoKycCatalogs>>(
      `${this.apiUrl}/formato-kyc/get-catalogs`,
      { params: { word: word ?? ''  } }
    );
  }

  delete(_id: ObjectId): Observable<IResponse<IFormatoKycDelete>> {
    return this.http.post<IResponse<IFormatoKycDelete>>(
      `${this.apiUrl}/formato-kyc/delete`,
      { _id }
    );
  }

  getFileBase64ByFileName(
    documento: string
  ): Observable<IResponse<IFormatoKycFileBase64>> {
    return this.http.get<IResponse<IFormatoKycFileBase64>>(
      `${this.apiUrl}/formato-kyc/download/${documento}`
    );
  }

  getByProyectoAseguradora(
    aseguradora: string
  ): Observable<IResponse<IFormatoKYC>> {
    return this.http.get<IResponse<IFormatoKYC>>(
      `${this.apiUrl}/formato-kyc/getFormatoKyc/${aseguradora}`
    );
  }
}
