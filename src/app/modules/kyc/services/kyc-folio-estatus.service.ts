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
  IFolioLayout,
  IKycFolioEstatusPaginate,
} from '../pages/core/helpers/interfaces/kyc-folio-estatus';

@Injectable({
  providedIn: 'root',
})
export class KycFolioEstatusService {
  private readonly apiURL = `${environment.urlApi}/core/folio`;

  constructor(private http: HttpClient) {}

  paginateAll(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IKycFolioEstatusPaginate>>> {
    return this.http.get<IResponse<IPaginate<IKycFolioEstatusPaginate>>>(
      `${this.apiURL}/paginateLayouts?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  getLayoutDetailsByHeader(
    header: ObjectId,
    paginateParams: IPaginateParams
  ): Observable<IResponse<IFolioLayout>> {
    return this.http.get<IResponse<IFolioLayout>>(
      `${this.apiURL}/find-layout/${header}?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }
}
