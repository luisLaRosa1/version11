import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContactoTelefonicoService } from 'src/app/modules/kyc/services/kyc.contacto-telefonico.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IBandejaPaginate } from '../../helpers/interfaces/bandeja';
import { IContactoTelefonicoPaginate } from '../../helpers/interfaces/contacto-telefonico';

@Component({
  selector: 'app-kyc-historial-contacto-telefonico',
  templateUrl: './kyc-historial-contacto-telefonico.component.html',
  styleUrls: ['./kyc-historial-contacto-telefonico.component.scss'],
})
export class KycHistorialContactoTelefonicoComponent {
  folio!: IBandejaPaginate;
  itemsPorPage: Array<number> = [];
  dataSource = new MatTableDataSource();
  contacto: Array<IContactoTelefonicoPaginate> = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayColumns = [
    'fechaContacto',
    'usuario',
    'tipoLlamada',
    'estatus',
    'fechaProximaLlamada',
    'observaciones',
  ];

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'fechaContacto',
    sort: 'desc',
    search: '',
  };

  constructor(
    private contactoTelefonicoService: ContactoTelefonicoService,
    private userStorageService: UserStorageService
  ) {
    this.itemsPorPage = AppConsts.SETTINGS.COMPONENTS.TABLE.ItemsPorPage;
  }

  ngOnInit(): void {
    this.folio = this.userStorageService.getFolioInfo()!;
    this.findAll();
  }

  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.findAll();
  }

  sortChange(sort: { active: string; direction: string }) {
    this.paginateParams.sort = sort.direction;
    this.paginateParams.order = sort.active;
    this.length = 0;
    this.pageIndex = 0;
    this.findAll();
  }

  findAll() {
    this.contactoTelefonicoService
      .findAll(this.folio.folio, this.paginateParams)
      .subscribe(
        (response: IResponse<IPaginate<IContactoTelefonicoPaginate>>) => {
          if (response.success) {
            this.dataSource.data = response.data.docs;
            this.length = response.data.totalDocs;
          }
        }
      );
  }
}
