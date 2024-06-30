import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { IKycValidacionDigital } from '../pages/core/helpers/interfaces/kyc-core-validacion-documental';

@Injectable({
  providedIn: 'root',
})
export class KycValidacionFirmasService {
  private readonly apiUrl = `${environment.urlApi}/core/validacion-firmas`;

  constructor(private http: HttpClient) {}

  getByIdAndGetCatalogosToEdit(
    _id: string
  ): Observable<IResponse<IKycValidacionDigital>> {
    return this.http.get<IResponse<IKycValidacionDigital>>(
      `${this.apiUrl}/find-one-to-edit/${_id}`
    );
  }

  update(
    _id: string,
    validacion: IKycValidacionDigital
  ): Observable<IResponse<IKycValidacionDigital>> {
    return this.http.put<IResponse<IKycValidacionDigital>>(
      `${this.apiUrl}/${_id}`,
      validacion
    );
  }

  create(
    validacion: IKycValidacionDigital
  ): Observable<IResponse<IKycValidacionDigital>> {
    return this.http.post<IResponse<IKycValidacionDigital>>(
      `${this.apiUrl}`,
      validacion
    );
  }
}
