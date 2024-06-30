import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IConfiguracionDocumental } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { ICargaDocumentalMasivaCatalogs } from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { EPerfil } from 'src/app/shared/helpers/enums/core/perfil.enum';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { AuthStorageService } from 'src/app/shared/services/storage/auth-storage.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { KycExpedienteDigitalService } from 'src/app/modules/kyc/services/kyc-expediente-digital.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { IBandejaPaginate } from '../../../../core/helpers/interfaces/bandeja';
import { IKycArchivoValidacion } from '../../../../core/helpers/interfaces/kyc-core-validacion-documental';
import { SwalService } from 'src/app/shared/services/notification/swal.service';

@Component({
  selector: 'app-kyc-encabezado-participantes',
  templateUrl: './kyc-encabezado-participantes.component.html',
  styleUrls: ['./kyc-encabezado-participantes.component.scss'],
})
export class KycEncabezadoParticipantesComponent implements OnInit {
  readonly #notifierService = inject(NotifierService);
  readonly #userStorageService = inject(UserStorageService);
  readonly #authStorageService = inject(AuthStorageService);
  readonly #expedienteService = inject(KycExpedienteDigitalService);
  readonly #utilService = inject(UtilsService);
  readonly #swal = inject(SwalService);
  readonly #configuracionDocumentalService = inject(
    AdmConfiguracionDocumentalService
  );

  constructor() {
    this.itemsPorPage = AppConsts.SETTINGS.COMPONENTS.TABLE.ItemsPorPage;
  }

  itemsPorPage: Array<number> = [];
  userSession!: IUserStorageUserDto;
  mostrarEliminar: boolean = false;
  idFolio: string = '';
  displayedColumns: string[] = [
    'sendFormatosFirmados',
    'clasificacion',
    'documento',
    'archivo',
    'fechaCarga',
    'operaciones',
  ];
  archivos: IKycArchivoValidacion[] = [];
  dataSource = new MatTableDataSource<any>(this.archivos);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  folio!: IBandejaPaginate;
  configuracion!: IConfiguracionDocumental;
  catalogos: ICargaDocumentalMasivaCatalogs = {};
  readonlyModule: boolean = false;
  blnSendFormatosFirmados: boolean = false;

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: IPaginateParams = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'fechaHoraAlta',
    sort: 'desc',
    search: '',
  };
  pageEvent!: PageEvent;

  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.getArchivos();
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.folio = this.#userStorageService.getFolioInfo()!;
    const userSession = this.#userStorageService.getCurrentUserInfo();
    if (!userSession) {
      this.#authStorageService.logout();
      return;
    }
    this.userSession = userSession!;

    this.mostrarEliminar =
      userSession.proyecto.rol.clave === EPerfil.ADMINISTRADOR ||
      userSession.proyecto.rol.clave === EPerfil.HELPDESK_INTERNO ||
      userSession.proyecto.rol.clave === EPerfil.SUPERVISOR_MESA;

    //! Regla de negocio solo se permite seleccionar documentos para enviar a formatos firmados al rol Ejecutivo de mesa
    this.blnSendFormatosFirmados =
      userSession.proyecto.rol.clave == EPerfil.EJECUTIVO_MESA;

    this.loadAction();
    this.getArchivos();
  }

  loadAction() {
    this.#configuracionDocumentalService
      .getConfiguracionDocumentalByProyecto(
        this.folio.proyecto!,
        this.folio.aseguradoraId!,
        this.folio.titular
      )
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {
            this.configuracion = response.data;
            this.catalogos.documento = response.data?.documento.filter(
              (element: any) => element.categoria == 1
            );
          } else console.error(response.message);
        },
        error: (err) => this.#notifierService.error(err?.error?.message),
      });
  }

  getArchivos() {
    this.#expedienteService
      .find_by_titular_paginate(
        this.folio.pais,
        this.folio.aseguradoraId,
        this.folio.proyecto,
        this.folio.titular,
        this.folio.folio,
        this.paginateParams
      )
      .subscribe((response) => {
        if (response.success) {
          this.archivos = response.data.docs;
          this.dataSource.data = this.archivos;
          this.length = response.data.totalDocs;
        }
      });
  }

  get_icon(archivo: string) {
    const extension = archivo.split('.').pop()!.toUpperCase();
    let url = '';
    switch (extension) {
      case 'PDF':
        url = 'assets/images/icons/pdf.png';
        break;

      case 'PNG':
        url = 'assets/images/icons/png.png';
        break;

      case 'JPG':
      case 'JPEG':
        url = 'assets/images/icons/jpg.png';
        break;

      case 'ZIP':
      case 'RAR':
        url = 'assets/images/icons/zip.png';
        break;

      case 'XLS':
      case 'XLSX':
        url = 'assets/images/icons/xls.png';
        break;

      default:
        url = 'assets/images/icons/jpg.png';
        break;
    }
    return url;
  }

  updateEventUploadFile(file: any) {
    this.getArchivos();
  }


  mostrar(id: string) {

    let a = document.createElement('a');
    this.#expedienteService.getByArchivo(id).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          let blobFile = this.#utilService.b64toBlob(
            response.data.base64,
            response.data.contentType,
            512
          );
          let urlBlobFile = window.URL.createObjectURL(blobFile);
          window.open(
            urlBlobFile,
            '_blank',
            'location=yes,height=650,width=600,scrollbars=yes,status=yes'
          );
        }
      },
    });
  }

  click_eliminar(archivoId: string) {
    this.#swal
      .question({
        text: '¿Realmente desea eliminar el archivo?',
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.#expedienteService.deleteFile(archivoId).subscribe((response) => {
            if (response.success) {
              this.getArchivos();
            }
          });
        }
      });
  }

  changeFormatosFimados(row: any, event: MatSlideToggleChange) {
    this.#expedienteService
      .updateSendFormatosFirmados(row.id, event.checked, this.folio.folio)
      .subscribe((response) => { });
  }
}
