import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { KycFolioEstatusService } from 'src/app/modules/kyc/services/kyc-folio-estatus.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import {
  IFolioLayout,
  IFolioLayoutDetail,
  IFolioLayoutHeader,
} from '../../helpers/interfaces/kyc-folio-estatus';

@Component({
  selector: 'app-kyc-folio',
  templateUrl: './kyc-folio-estatus-details.component.html',
  styleUrls: ['./kyc-folio-estatus-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class KycFolioEstatusDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  itemsPorPage: Array<number> =
    AppConsts.SETTINGS.COMPONENTS.TABLE.ItemsPorPage;

  expandedElement!: IFolioLayoutDetail;

  layoutHeader: IFolioLayoutHeader = <IFolioLayoutHeader>{};
  dataSource = new MatTableDataSource();

  breadcrumbs: string[] = ['Conoce a tu cliente', 'Folio', 'Estatus carga'];
  displayColumns = ['rowIndex', 'message'];

  totalDocs: number = 0;

  paginateParams: IPaginateParams = {
    pageSize: 1000,
    pageIndex: 0,
    order: 'rowIndex',
    sort: 'asc',
    search: '',
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly notifierService: NotifierService,
    private folioEstatusService: KycFolioEstatusService
  ) {}

  ngOnInit(): void {
    const header = this.activatedRoute.snapshot.params['header'] || '';
    this.paginateAll(header);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  paginateAll(idHeader: string): void {
    if (idHeader === '') {
      this.return();
      this.notifierService.error('El identificador del layout no es válido');
      return;
    }

    this.folioEstatusService
      .getLayoutDetailsByHeader(idHeader, this.paginateParams)
      .subscribe({
        next: (response: IResponse<IFolioLayout>) => {
          if (response.success) {
            const { header, details } = response.data;
            this.layoutHeader = header;
            this.dataSource.data = details.docs;
          } else console.error(response.message);
        },
        error: (err) => {
          this.dataSource.data = [];
          this.return();
          this.notifierService.error(err?.error?.message);
        },
      });
  }

  expandedClick(element: any): void {
    if (element && element.columns?.length > 0) this.expandedElement = element;
  }

  return(): void {
    this.router.navigateByUrl(`/folio/estatus-carga`);
  }
}
