import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { distinctUntilChanged, map } from 'rxjs';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { AuthStorageService } from 'src/app/shared/services/storage/auth-storage.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { KycListaNegraService } from '../../../services/kyc-lista-negra.service';
import { SearchDataService } from '../../../services/search.service';
import {
  CreateFoliosAutorizadosDto,
  IListaNegraPaginate,
} from '../helpers/interfaces/kyc-lista-negra';

@Component({
  selector: 'app-kyc-lista-negra',
  templateUrl: './kyc-lista-negra.component.html',
  styleUrls: ['./kyc-lista-negra.component.scss'],
})
export class KycListaNegraComponent {
  itemsPorPage: Array<number> = [];
  foliosAutorizar = new CreateFoliosAutorizadosDto();

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
    private notifierService: NotifierService,
    private searchDataService: SearchDataService,
    private userStorageService: UserStorageService,
    private listaNegraService: KycListaNegraService,
    private authStorageService: AuthStorageService,
    private swalService: SwalService
  ) {
    this.itemsPorPage = AppConsts.SETTINGS.COMPONENTS.TABLE.ItemsPorPage;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  breadcrumbs: string[] = ['Lista negra', 'Búsquedas'];

  userSession!: IUserStorageUserDto;
  listaNegra: Array<IListaNegraPaginate> = [];
  dataSource = new MatTableDataSource();
  displayColumns = [
    'folioMultisistema',
    'cliente',
    'tipoContribuyente',
    // 'pais',
    'fechaEnvio',
    'fechaAutorizacion',
    'autorizado',
  ];

  ngOnInit(): void {
    this.search();
    const userSession = this.userStorageService.getCurrentUserInfo();
    if (!userSession) {
      this.authStorageService.logout();
      return;
    }
    this.userSession = userSession!;
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
    this.listaNegraService.findAll(this.paginateParams).subscribe({
      next: (response: IResponse<IPaginate<IListaNegraPaginate>>) => {
        if (response.success) {
          if (this.foliosAutorizar.folios.length > 0) {
            this.listaNegra = response.data.docs.map((x) => {
              const match = this.foliosAutorizar.folios.find(
                (y) => x.folio === y.folio
              );
              if (match) {
                x = { ...x, changeAutorizar: match.autorizado };
              }
              return x;
            });
          }
          this.dataSource.data =
            this.foliosAutorizar.folios.length > 0
              ? this.listaNegra
              : response.data.docs;
          this.length = response.data.totalDocs;
        } else console.error(response.message);
      },
      error: (err) => {
        this.notifierService.error(err?.error?.message);
      },
    });
  }

  onChangeCheck(data: any): void {
    const documentoValidar = this.foliosAutorizar.folios.find(
      (folio) => folio.folio === data.folio
    );
    if (documentoValidar) {
      this.removeFromFoliosAutorizar(data);
    } else {
      this.addToFoliosAutorizar(data);
    }
  }

  private addToFoliosAutorizar(data: any): void {
    const folio = {
      folio: data.folio,
      folioCliente: data.folioCodigo,
      autorizado: data.changeAutorizar,
      folioMultisistema: data.folioMultisistema
    };
    this.foliosAutorizar.folios.push(folio);
  }

  private removeFromFoliosAutorizar(data: any): void {
    const indice = this.foliosAutorizar.folios.findIndex(
      (elemento) => elemento.folio === data.folio
    );
    if (indice !== -1) {
      this.foliosAutorizar.folios.splice(indice, 1);
    }
  }

  submit(): void {
    if (this.foliosAutorizar.folios.length === 0) {
      this.swalService.warning({
        text: 'Debe seleccionar al menos un folio para la autorización',
      });
      return;
    }

    this.listaNegraService.create(this.foliosAutorizar).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.swalService
            .success({
              text: 'Información almacenada correctamente.',
            })
            .then((result) => {
              this.foliosAutorizar = new CreateFoliosAutorizadosDto();
              this.paginateAll();
            });
        }
      },
      error: (err) => this.notifierService.error(err?.error?.errorMessage),
    });
  }
}
