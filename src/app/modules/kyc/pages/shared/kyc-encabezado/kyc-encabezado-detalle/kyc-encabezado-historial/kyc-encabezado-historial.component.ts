import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EKycEstatusActividad } from 'src/app/modules/administracion/helpers/enums/kyc-estatus-actividad.enum';
import { KycWorkFlowService } from 'src/app/modules/kyc/services/kyc-core.workflow.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IBandejaPaginate } from '../../../../core/helpers/interfaces/bandeja';

@Component({
  selector: 'app-kyc-encabezado-historial',
  templateUrl: './kyc-encabezado-historial.component.html',
})
export class KycEncabezadoHistorialComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #userStorageService = inject(UserStorageService);
  readonly #workFlowService = inject(KycWorkFlowService);

  constructor() {
    this.itemsPorPage = AppConsts.SETTINGS.COMPONENTS.TABLE.ItemsPorPage;
  }

  readonlyModule: boolean = false;

  displayedColumns: string[] = [
    'actividad',
    'estatus',
    'usuario',
    'perfil',
    'fechaAlta',
    'fechaFin',
  ];
  actividades: [] = [];
  dataSource = new MatTableDataSource<any>(this.actividades);
  folio!: IBandejaPaginate;

  estatusActividad = {
    nueva: EKycEstatusActividad.NUEVA,
    enProgreso: EKycEstatusActividad.EN_PROGRESO,
    completada: EKycEstatusActividad.COMPLETADA,
    enReproceso: EKycEstatusActividad.EN_REPROCESO,
    cancelada: EKycEstatusActividad.CANCELADA,
    finalizada: EKycEstatusActividad.FINALIZADA,
    suspendida: EKycEstatusActividad.SUSPENDIDA,
    programada: EKycEstatusActividad.PROGRAMADA,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  itemsPorPage: Array<number> = [];
  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = [5, 10, 15];
  paginateParams: IPaginateParams = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'rowIndex',
    sort: 'asc',
    search: '',
  };
  pageEvent!: PageEvent;

  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.getActividades();
  }

  ngOnInit(): void {
    this.init();
    this.getActividades();
  }

  init() {
    this.folio = this.#userStorageService.getFolioInfo()!;
  }

  getActividades(): void {
    this.#workFlowService
      .getInfoFolioActividadesPaginate(
        this.folio.folioMultisistema,
        this.folio.proyecto,
        this.paginateParams
      )
      .subscribe((response: IResponse<any>) => {
        this.actividades = response.data.docs;
        this.dataSource.data = this.actividades;
        this.length = response.data.totalDocs;
      });
  }

  return(): void {
    this.#router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }
}
