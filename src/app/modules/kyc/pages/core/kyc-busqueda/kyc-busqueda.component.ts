import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';
import { BandejaService } from 'src/app/modules/kyc/services/bandeja.service';
import { SearchDataService } from 'src/app/modules/kyc/services/search.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IBandejaPaginate } from '../helpers/interfaces/bandeja';
@Component({
  selector: 'app-kyc-busqueda',
  templateUrl: './kyc-busqueda.component.html',
  styleUrls: ['./kyc-busqueda.component.scss'],
})
export class KycBusquedaComponent {
  currentActiveButton: number = 1;
  itemsPorPage: Array<number> = [];

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'fechaAlta',
    sort: 'desc',
    search: '',
  };
  pageEvent!: PageEvent;

  constructor(
    private router: Router,
    private bandejaService: BandejaService,
    private notifierService: NotifierService,
    private searchDataService: SearchDataService,
    private userStorageService: UserStorageService
  ) {
    this.itemsPorPage = AppConsts.SETTINGS.COMPONENTS.TABLE.ItemsPorPage;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  breadcrumbs: string[] = ['Bandejas', 'Búsquedas'];

  bandejas: Array<IBandejaPaginate> = [];
  dataSource = new MatTableDataSource();
  displayColumns = [
    'folioMultisistema',
    'cliente',
    'riesgo',
    'aseguradora',
    'actividad',
    'estado',
    'fechaAlta',
  ];

  ngOnInit(): void {
    this.search();
  }

  setActive(index: any) {
    this.currentActiveButton = index;
    this.paginateAll();
  }

  onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.paginateAll();
  }

  sortChange(sort: { active: string; direction: string }) {
    this.paginateParams.sort = sort.direction;
    this.paginateParams.order = sort.active;
    this.length = 0;
    this.pageIndex = 0;
    this.paginateAll();
  }

  search() {
    this.searchDataService
      .getValueSearch()
      .pipe(
        distinctUntilChanged(),
        map((val) => val)
      )
      .subscribe((value) => {
        this.paginateParams.search = '';
        this.paginateParams.search = value.trim();
        this.paginateParams.pageSize = 10;
        this.paginateParams.pageIndex = 0;
        this.paginateAll();
      });
  }

  paginateAll() {
    this.bandejaService
      .busquedas(this.currentActiveButton.toString(), this.paginateParams)
      .subscribe({
        next: (response: IResponse<IPaginate<IBandejaPaginate>>) => {
          if (response.success) {
            this.dataSource.data = response.data.docs;
            this.length = response.data.totalDocs;
          } else console.error(response.message);
        },
        error: (err) => {
          this.notifierService.error(err?.error?.message);
        },
      });
  }

  onRowDoubleClick(row: IBandejaPaginate): void {
    if (!row) {
      this.notifierService.warning(
        'No se pudo obtener la información del registro'
      );
      return;
    }

    const paths = [
      { actividad: KYCEActividad.SOLICITUD, path: '/solicitud/' },
      { actividad: KYCEActividad.CARGA_DOCUMENTAL, path: '/carga-documental/' },
      {
        actividad: KYCEActividad.VALIDACION_DIGITAL,
        path: '/validacion-digital/',
      },
      { actividad: KYCEActividad.FIRMA_CLIENTE, path: '/firma-cliente/' },
      { actividad: KYCEActividad.FIRMA_EJECUTIVO, path: '/firma-ejecutivo/' },
      {
        actividad: KYCEActividad.VALIDACION_FIRMAS,
        path: '/validacion-firma/',
      },
      {
        actividad: KYCEActividad.CONTACTO_TELEFONICO,
        path: '/contacto-telefonico/',
      },
      {
        actividad: KYCEActividad.CONTACTO_ASEGURADORA,
        path: '/contacto-aseguradora/',
      },
      {
        actividad: KYCEActividad.CONFIRMACION_ENTREGA,
        path: '/confirmacion-entrega/',
      },
    ];

    const nextActividad = paths.find(
      (p) => p.actividad === row.actividadCodigo
    );

    if (nextActividad) {
      this.router.navigate([nextActividad.path, row.folio], {
        state: {
          readonlyModule: true,
        },
      });

      return;
    }

    this.notifierService.error(
      'Se produjo un error al intentar acceder al siguiente módulo'
    );
  }
}
