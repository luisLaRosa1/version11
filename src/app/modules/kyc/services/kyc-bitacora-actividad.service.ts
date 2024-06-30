import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import {
  IKycBitacora,
  IKycBitacoraDetalle,
} from '../pages/core/helpers/interfaces/kyc-bitacora';

@Injectable({
  providedIn: 'root',
})
export class KycWorkFlowActividadService {
  readonly apiUrl = `${environment.urlApi}/bitacora/actividad`;

  constructor(private http: HttpClient) {}

  create(data: IKycBitacora) {
    return this.http.post<IResponse<IKycBitacoraDetalle>>(
      `${this.apiUrl}`,
      data
    );
  }
}
