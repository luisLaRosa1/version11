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
  ICatalogos,
  IContactoTelefonico,
  IContactoTelefonicoPaginate,
  InformacionContactoDto,
  InformacionTelefonicaDto,
} from '../pages/core/helpers/interfaces/contacto-telefonico';

@Injectable({
  providedIn: 'root',
})
export class ContactoTelefonicoService {
  readonly apiUrl = `${environment.urlApi}/core/contacto-telefonico`;

  constructor(private http: HttpClient) {}

  getCatalogos(): Observable<IResponse<ICatalogos>> {
    return this.http.get<IResponse<ICatalogos>>(`${this.apiUrl}/get-catalogos`);
  }

  getFechaProximaLlamada(clave: number): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${this.apiUrl}/estatus/${clave}`);
  }

  insert(contacto: IContactoTelefonico): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(`${this.apiUrl}`, contacto);
  }

  findAll(
    folio: string,
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IContactoTelefonicoPaginate>>> {
    return this.http.get<IResponse<IPaginate<IContactoTelefonicoPaginate>>>(
      `${this.apiUrl}/find-all/${folio}?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  insertTelefonoCorrespondencia(
    informacionTelefonicaDto: any
  ): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${this.apiUrl}/create-informacion-telefonica`,
      informacionTelefonicaDto
    );
  }

  getTelefonosCorrespondencia(
    id: string
  ): Observable<IResponse<InformacionTelefonicaDto[]>> {
    return this.http.get<IResponse<InformacionTelefonicaDto[]>>(
      `${this.apiUrl}/find-informacion-telefonica/${id}`
    );
  }

  getInformacionContacto(
    id: string
  ): Observable<IResponse<InformacionContactoDto>> {
    return this.http.get<IResponse<InformacionContactoDto>>(
      `${this.apiUrl}/find-one-informacion-contacto/${id}`
    );
  }

  updateInformacionContacto(
    _id: string,
    contacto: InformacionContactoDto
  ): Observable<IResponse<InformacionContactoDto>> {
    return this.http.put<IResponse<InformacionContactoDto>>(
      `${this.apiUrl}/informacion-contacto/${_id}`,
      contacto
    );
  }

  deleteTelefonoCorrespondencia(id: string): Observable<IResponse<any>> {
    return this.http.delete<IResponse<any>>(
      `${this.apiUrl}/delete-informacion-telefonica/${id}`
    );
  }

  updateToBandejaProgramada(
    folio: number,
    actividad: number
  ): Observable<IResponse<any>> {
    return this.http.put<IResponse<any>>(
      `${this.apiUrl}/update-to-bandeja-programada/${folio}/${actividad}`,
      {}
    );
  }

  finalizaActividad(
    folioMultisistema: number,
    folio: string,
    actividad: number,
    comentario:string
  ): Observable<IResponse<any>> {
    return this.http.put<IResponse<any>>(
      `${this.apiUrl}/finaliza-actividad/${folioMultisistema}/${folio}/${actividad}`,
      {comentario}
    );
  }
}
