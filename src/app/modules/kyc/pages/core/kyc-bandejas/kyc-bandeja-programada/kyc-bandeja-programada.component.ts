import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { BandejaService } from 'src/app/modules/kyc/services/bandeja.service';
import { SearchDataService } from 'src/app/modules/kyc/services/search.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IBandejaPaginate } from '../../helpers/interfaces/bandeja';

@Component({
  selector: 'app-kyc-bandeja-programada',
  templateUrl: './kyc-bandeja-programada.component.html',
  styleUrls: ['./kyc-bandeja-programada.component.scss'],
})
export class KycBandejaProgramadaComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource();
  bandejas: Array<IBandejaPaginate> = [];
  breadcrumbs: string[] = ['Bandejas', 'Programadas'];
  displayColumns = [
    'folioMultisistema',
    'cliente',
    'riesgo',
    'aseguradora',
    'actividad',
    // 'sla',
    'estado',
    'fechaAlta',
  ];

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

  ngOnInit(): void {
    this.search();
  }

  public onChangePage(e: PageEvent) {
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
    this.bandejaService.programadas(this.paginateParams).subscribe({
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

    this.userStorageService.saveFolioInfo(row);

    switch (row.actividad) {
      case 'Solicitud': {
        this.router.navigate(['/solicitud/', row.folio]);
        break;
      }
      case 'Carga documental': {
        this.router.navigate(['/carga-documental/', row.folio]);
        break;
      }
      case 'Validación digital': {
        this.router.navigate(['/validacion-digital/', row.folio]);
        break;
      }
      case 'Contacto telefónico': {
        this.router.navigate(['/contacto-telefonico/', row.folio]);
        break;
      }
      case 'Contacto aseguradora': {
        this.router.navigate(['/contacto-aseguradora/', row.folio]);
        break;
      }
    }
  }
}
