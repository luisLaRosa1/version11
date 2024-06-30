import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginateParamsGenerator } from 'src/app/shared/helpers/generator/paginate-params.generator';
import {
  IPaginate,
  IPaginateParams,
} from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import {
  CreateFoliosAutorizadosDto,
  IListaNegraPaginate,
} from '../pages/core/helpers/interfaces/kyc-lista-negra';

@Injectable({
  providedIn: 'root',
})
export class KycListaNegraService {
  readonly apiUrl = `${environment.urlApi}/core/lista-negra`;

  constructor(private http: HttpClient) {}

  findAll(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IListaNegraPaginate>>> {
    return this.http.get<IResponse<IPaginate<IListaNegraPaginate>>>(
      `${this.apiUrl}/findAll?${PaginateParamsGenerator.getUri(paginateParams)}`
    );
  }

  create(data: CreateFoliosAutorizadosDto) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  findFolioAutorizado(folio: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl}/find-folio-autorizado/${folio}`
    );
  }
}
