import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';
import { AppConsts } from 'src/app/shared/AppConsts';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { IKeyValue, IsKeyValueSwitch } from 'src/app/shared/helpers/interfaces/key-value.interface';
import { AbstractControl, FormControl } from '@angular/forms';
import { FormConfigTypeAPI, IAmparoAPI, IRequestExclusionAPI, ModalConfigDataAPI } from '../../../adm-regla-negocio/form-cumulos/api_data_cumulos';
import { tipoRuleListData } from '../../../adm-regla-negocio/api_datable_reglas';


@Component({
  selector: 'app-kyc-modal',
  templateUrl: './kyc-modal.component.html',
  styleUrls: ['./kyc-modal.component.scss']
})
export class KycModalComponent {
  isOpened: boolean = false;
  originalOpciones: IKeyValue[] = [];

  destroy$ = new Subject<void>();

  // EXCLUSIONS PORTAL
  exclusionsPortalColumns = ['codPlan', 'descExclusion', 'accion', 'observacion'];
  exclusionsPortalDataSource!: MatTableDataSource<IRequestExclusionAPI>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  itemsPorPage: Array<number> = [];
  
  // EXTRA PRIMAS
  extraPrimasColumns = [
    'codPlan',
    'cobertura',
    'calcularExtraprima',
    'observacion',
  ];

  areaSelected = new FormControl([]);
  tipoRuleList = tipoRuleListData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalConfigDataAPI,
    public readonly dialogRef: MatDialogRef<KycModalComponent>,
  ) {
    console.log("Todos los datos son:", data);
    this.data.msgError = this.data.msgError ?? 'Completar los campos obligatorios';
    this.itemsPorPage = AppConsts.ZURICH_TABLE_FORMAT.pagination.table.itemsPorPage;
  }

  onCloseModal() {
    this.isOpened = false;
  }

}

interface ConfigForAutocomplete {
  index: number;
  options: IsKeyValueSwitch[];
  control: AbstractControl;
  filteredOptions: Observable<IsKeyValueSwitch[]>;
  filterCurrent: string;
}

