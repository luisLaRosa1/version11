import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginateParamsGenerator } from 'src/app/shared/helpers/generator/paginate-params.generator';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { IWorlFlow } from '../../administracion/helpers/interfaces/core-workflow';

@Injectable({
  providedIn: 'root',
})
export class KycWorkFlowService {
  private readonly apiUrl = `${environment.urlApi}/workflow`;

  constructor(private http: HttpClient) {}

  getInfoFolioActividad(folio: number, actividad: number, proyecto: string) {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl}/actividad-by-folio?folio=${folio}&actividad=${actividad}&proyecto=${proyecto}`
    );
  }

  getInfoFolioActividades(folio: number, proyecto: string) {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl}/actividades-by-folio?folio=${folio}&proyecto=${proyecto}`
    );
  }

  actualizarActividad(_id: string): Observable<IResponse<any>> {
    return this.http.put<IResponse<any>>(
      `${this.apiUrl}/actualizar-actividad/${_id}`,
      {}
    );
  }

  avanzar(workflow: IWorlFlow): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${environment.urlApi}/core/solicitud/avanzar-solicitud`,
      workflow
    );
  }

  reenviarFormatosFirmadosSolicitud(
    workflow: IWorlFlow
  ): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${environment.urlApi}/core/solicitud/reenviar-formatos-firmados-solicitud`,
      workflow
    );
  }

  notificacionNoContinuaProceso(
    workflow: IWorlFlow
  ): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${environment.urlApi}/core/solicitud/notificacion-no-continua-proceso`,
      workflow
    );
  }

  getInfoFolioActividadesPaginate(
    folio: number,
    proyecto: string,
    paginateParams: IPaginateParams
  ) {
    return this.http.get<IResponse<any>>(
      `${
        this.apiUrl
      }/actividades-by-folio-paginated/${folio}/${proyecto}?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }
}
