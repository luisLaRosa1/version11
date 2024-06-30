import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { IKycWorkflowDetalle } from '../pages/core/helpers/interfaces/kyc-workflow';

@Injectable({
  providedIn: 'root',
})
export class KycWorkFlowActividadService {
  readonly apiUrl = `${environment.urlApi}/core/bandeja`;

  constructor(private http: HttpClient) {}

  getActividadByFolioAndActividad(
    folio: string,
    actividad: number
  ): Observable<IResponse<IKycWorkflowDetalle>> {
    return this.http.get<IResponse<IKycWorkflowDetalle>>(
      `${this.apiUrl}/workflow/${folio}/${actividad}`,
      {}
    );
  }
}
