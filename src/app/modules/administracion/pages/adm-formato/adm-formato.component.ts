import { Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import {
  IFormatoKycDelete,
  IFormatoKycFileBase64,
  IFormatoKycPaginate,
} from '../../helpers/interfaces/adm-formato';
import { AdmFormatoKycService } from '../../services/adm-formato.service';
import { SearchDataService } from 'src/app/modules/kyc/services/search.service';
import { distinctUntilChanged, map } from 'rxjs';
@Component({
  selector: 'app-kyc-formato',
  templateUrl: './adm-formato.component.html',
})
export class AdmFormatoComponent {
  readonly #searchDataService = inject(SearchDataService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<IFormatoKycPaginate> =
    new MatTableDataSource();
  breadcrumbs: string[] = ['Administración', 'Formato kyc'];
  itemsPorPage: Array<number> = [];
  formatosKyc: Array<IFormatoKycPaginate> = [];
  formatoKycDelete: IFormatoKycDelete | null = null;
  displayedColumns: string[] = [
    'pais',
    'aseguradora',
    'documento',
    'tipoPersona',
    'action',
  ];

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'aseguradora',
    sort: 'asc',
    search: '',
  };
  pageEvent!: PageEvent;

  constructor(
    private notifierService: NotifierService,
    private router: Router,
    private formatoKycService: AdmFormatoKycService,
    private utils: UtilsService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.#searchDataService.setValueSearch('');
    this.itemsPorPage = AppConsts.SETTINGS.COMPONENTS.TABLE.ItemsPorPage;
    // this.paginateAll();
    this.search();
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
    this.formatoKycService.paginateAll(this.paginateParams).subscribe({
      next: (response: IResponse<IPaginate<IFormatoKycPaginate>>) => {
        if (response.success) {
          this.dataSource.data = response.data.docs;
          this.length = response.data.totalDocs;
        } else console.error(response.message);
      },
      error: (err) => this.notifierService.warning(err?.error?.message),
    });
  }

  create(): void {
    this.router.navigateByUrl('/administracion/formatos/crear');
  }

  detalle(_id: string): void {
    this.router.navigateByUrl(`/administracion/formatos/ver/${_id}`);
  }

  viewDownload(documento: any, view: boolean): void {
    this.formatoKycService.getFileBase64ByFileName(documento._id).subscribe({
      next: (response: IResponse<IFormatoKycFileBase64>) => {
        if (response.success) {
          let blobFile = this.utils.b64toBlob(
            response.data.base64,
            response.data.contentType,
            512
          );
          let urlBlobFile = window.URL.createObjectURL(blobFile);
          if (view) {
            window.open(
              urlBlobFile,
              '_blank',
              'location=yes,height=650,width=600,scrollbars=yes,status=yes'
            );
          } else {
            let a = document.createElement('a');
            a.href = urlBlobFile;
            a.target = '_blank';
            a.download = documento.nombre;
            a.click();
            URL.revokeObjectURL(urlBlobFile);
          }
        }
      },
      error: (err) => this.notifierService.error(err?.error?.message),
    });
  }

  delete(_id: string): void {
    this.swalService
      .question({
        html: 'Se eliminará el archivo</br>¿Está seguro?',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.formatoKycService.delete(_id).subscribe({
            next: (response: IResponse<IFormatoKycDelete>) => {
              if (response.success) {
                this.notifierService.success(response.message);
                this.paginateAll();
              } else console.error(response.message);
            },
            error: (err) => this.notifierService.warning(err?.error?.message),
          });
        }
      });
  }

  search() {
    this.#searchDataService
      .getValueSearch()
      .pipe(
        distinctUntilChanged(),
        map((val) => val)
      )
      .subscribe((value: string) => {
        this.paginateParams.search = '';
        this.paginateParams.search = value.trim();
        this.paginateParams.pageSize = 10;
        this.paginateParams.pageIndex = 0;
        this.paginateAll();
      });
  }
}
