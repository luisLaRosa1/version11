import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IArchivoValidacion } from 'src/app/modules/administracion/helpers/interfaces/core-validacion-documental';
// import { ExpedienteDigitalService } from 'src/app/modules/administracion/services/core-expediente-digital';
import { EFormAction } from 'src/app/shared/helpers/enums/form-action.enum';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-kyc-shared-checklist',
  templateUrl: './kyc-shared-checklist.component.html',
  styleUrls: ['./kyc-shared-checklist.component.scss'],
})
export class KycSharedChecklistComponent implements OnInit {
  @Input() dataValidacion: IArchivoValidacion[] = [];
  @Input() action!: EFormAction;
  @Input() isFirmado: boolean = false;
  @Input() readonlyModule: boolean = false;
  @Input() titular: string = '';

  @Output() updateEventEmitter = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'documento',
    'url',
    'correcto',
    'idMotivo',
    'fechaVigencia',
  ];

  dataSource = new MatTableDataSource<IArchivoValidacion>();
  isView: boolean = false;

  constructor(
    private utilsService: UtilsService // private expedienteService: ExpedienteDigitalService
  ) {}
  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<IArchivoValidacion>(
      this.dataValidacion
    );
    this.dataSource.paginator = this.paginator;
    this.isView = this.action === EFormAction.VIEW;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IArchivoValidacion>(
      this.dataValidacion
    );
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onChangeMotivo(index: number, value: number) {
    this.dataValidacion[index].idMotivo = value;
  }

  changeCorrecto(index: number, event: any) {
    this.dataValidacion[index].correcto = event.checked;
    if (event.checked) {
      this.dataValidacion[index].idMotivo = undefined;
    }
  }

  changeFechaVigencia(index: number, value: string) {
    this.dataValidacion[index].fechaVigencia = value;
  }

  showFile(url: string) {
    const urlFile = url.split('/');
    const nombreFile = urlFile[urlFile.length - 1];
    let a = document.createElement('a');
    // this.expedienteService.getFileBase64ByFileName(nombreFile, this.titular).subscribe({
    //   next: (response: IResponse<IFileBase64>) => {
    //     if (response.success) {
    //       let blobFile = this.utilsService.b64toBlob(
    //         response.data.fileBase64,
    //         response.data.type,
    //         512
    //       );
    //       let urlBlobFile = window.URL.createObjectURL(blobFile);
    //       window.open(
    //         urlBlobFile,
    //         '_blank',
    //         'location=yes,height=650,width=600,scrollbars=yes,status=yes'
    //       );
    //     }
    //   },
    // });
  }

  updateTableValidacion() {
    this.updateEventEmitter.emit();
  }
}
