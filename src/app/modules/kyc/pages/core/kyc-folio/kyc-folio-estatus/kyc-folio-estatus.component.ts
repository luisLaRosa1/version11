import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { KycFolioEstatusService } from 'src/app/modules/kyc/services/kyc-folio-estatus.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { IKycFolioEstatusPaginate } from '../../helpers/interfaces/kyc-folio-estatus';

@Component({
  selector: 'app-kyc-folio',
  templateUrl: './kyc-folio-estatus.component.html',
  styleUrls: ['./kyc-folio-estatus.component.scss'],
})
export class KycFolioEstatusComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  defaultPaginator = {
    page: 1,
    limit: AppConsts.SETTINGS.COMPONENTS.TABLE.Limit,
    search: '',
    itemsPorPage: AppConsts.SETTINGS.COMPONENTS.TABLE.ItemsPorPage,
  };

  dataSource: MatTableDataSource<IKycFolioEstatusPaginate> =
    new MatTableDataSource();
  layouts: Array<IKycFolioEstatusPaginate> = [];
  itemsPorPage: Array<number> =
    AppConsts.SETTINGS.COMPONENTS.TABLE.ItemsPorPage;
  breadcrumbs: string[] = ['Conoce a tu cliente', 'Folio', 'Estatus carga'];
  displayColumns = [
    'filename',
    'archivoSize',
    'totalRows',
    'correcto',
    'fechaInicioCarga',
  ];

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'fechaInicioCarga',
    sort: 'desc',
    search: '',
  };
  pageEvent!: PageEvent;

  constructor(
    private readonly router: Router,
    private readonly notifierService: NotifierService,
    private readonly folioEstatusService: KycFolioEstatusService
  ) {}

  ngOnInit(): void {
    this.paginateAll();
  }

  sortChange(sort: { active: string; direction: string }) {
    this.paginateParams.sort = sort.direction;
    this.paginateParams.order = sort.active;
    this.length = 0;
    this.pageIndex = 0;
    this.paginateAll();
  }

  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.paginateAll();
  }

  paginateAll(): void {
    this.folioEstatusService.paginateAll(this.paginateParams).subscribe({
      next: (response: IResponse<IPaginate<IKycFolioEstatusPaginate>>) => {
        if (response.success) {
          this.dataSource.data = response.data.docs;
          this.length = response.data.totalDocs;
          //this.paginator.pageSize = response.data.hasNextPage;
        } else console.error(response.message);
      },
      error: (err) => this.notifierService.warning(err?.error?.message),
    });
  }

  onRowDoubleClick(row: IKycFolioEstatusPaginate): void {
    if (row && row.procesado && !row.correcto)
      this.router.navigateByUrl(`/folio/estatus-carga/${row._id}`);
  }
}
