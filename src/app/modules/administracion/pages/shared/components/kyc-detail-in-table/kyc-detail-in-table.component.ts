import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IAction, IColumn } from 'src/app/modules/kyc/pages/core/helpers/interfaces/detail-in-table';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginateOptions, IPaginationForComponent } from 'src/app/shared/helpers/interfaces/pagination-detail-in-table.interface';
import { convertCurrency } from 'src/app/shared/utils/convert-currency.function';

@Component({
  selector: 'app-kyc-detail-in-table',
  templateUrl: './kyc-detail-in-table.component.html',
  styleUrls: ['./kyc-detail-in-table.component.scss']
})
export class KycDetailInTableComponent<T> implements OnInit, OnDestroy {
  @Input('dataSource') inputDataSource!: Subject<T[]> | T[];  
  @Input() columns: IColumn[] = [];
  @Input() paginateOptions!: IPaginateOptions;
  @Input() itemsPorPage: Array<number> = AppConsts.ZURICH_TABLE_FORMAT.pagination.table.itemsPorPage;
  
  @Output() action: EventEmitter<T & IAction> = new EventEmitter();
  @Output() changeInPaginate = new EventEmitter<IPaginationForComponent>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<T, MatTableDataSourcePaginator>;

  get columnProperties(): string[] {
    return this.columns.map(column => column.property);
  }

  constructor(private readonly _liveAnnouncer: LiveAnnouncer, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    if(!Array.isArray(this.inputDataSource)) {
      this.inputDataSource.subscribe(data => {
        this.dataSource = new MatTableDataSource<T>(data);

        console.log(data);

        this.dataSource.sort = this.sort;
        if (!this.paginateOptions)
          this.dataSource.paginator = this.paginator;
      });
    } else {
      this.dataSource = new MatTableDataSource<T>(this.inputDataSource);
    }
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getIcon(dataForImg: string): string {
    let url = '';
    const fileType = dataForImg.split('/').pop();
    switch (fileType) {
      case 'pdf':
        url = 'assets/images/icons/pdf.png';
        break;

      case 'png':
        url = 'assets/images/icons/png.png';
        break;

      case 'jpg':
      case 'jpeg':
        url = 'assets/images/icons/jpg.png';
        break;

      case 'x-zip-compressed':
        url = 'assets/images/icons/zip.png';
        break;

      case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        url = 'assets/images/icons/xls.png';
        break;

      default:
        url = 'assets/images/icons/folder-open-1.svg';
        break;
    }
    return url;
  }

  onAction(row: T, iconName: string = ''): void {
    this.action.emit({...row, iconName});
  }

  onPageChange(paginateChange: IPaginationForComponent): void {
    this.changeInPaginate.emit(paginateChange);
  }

  ngOnDestroy(): void {
    this.action.complete();

    if(!Array.isArray(this.inputDataSource))
      this.inputDataSource.complete();
  }

  getAdminTableData(text: any, data: any) {
    if(this.router.url.split('/')[3] === 'parametrizar-cumulos') {
      if (text.id === data) {
        return data;
      }
      if (typeof data === 'number') {
        return convertCurrency(data);
        }
    }
    return data;
  }
}
