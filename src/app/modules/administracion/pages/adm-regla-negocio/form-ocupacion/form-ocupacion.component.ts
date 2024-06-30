import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { IAction, IColumn } from 'src/app/modules/kyc/pages/core/helpers/interfaces/detail-in-table';
import { KycModalTelefonoCorrespondenciaComponent } from 'src/app/modules/kyc/pages/core/shared/components/kyc-modal-telefono-correspondencia/kyc-modal-telefono-correspondencia.component';
import { KycModalComponent } from '../../shared/components/kyc-modal/kyc-modal.component';
import { statusListData, tipoRuleListData, tipoRuleOcupacionListData } from '../api_datable_reglas';

@Component({
  selector: 'app-form-ocupacion',
  templateUrl: './form-ocupacion.component.html',
  styleUrls: ['./form-ocupacion.component.scss']
})
export class FormOcupacionComponent implements OnInit{
  breadcrumbs: string[] = ['Administración', 'Parametrizar Ocupacion'];
  data: Array<any> = [{ codigo: 1, descripcion: 'Abarrotero (Propietario/empleado) ', accion:"Happy path" }, {  codigo: 2, descripcion: 'Agente Judicial', accion:"Rechazo automatico" } ];
  files: Array<any> = [{  name: 'CargaOcupacion1.xlsx'}, {  name: 'CargaOcupacion23.xlsx'}];
  private EDIT = 'fa-pen';
  private DELETE = 'fa-trash';
  Ocupaciones: string = ""
  displayedColumns: string[] = [
    'codigo',
    'descripcion',
    'action',
    'action2',
  ];
  displayedColumnsFiles: string[] = [
    'name',
  ];
  form!: UntypedFormGroup;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _notifierService: NotifierService,
    private readonly _formBuilder: FormBuilder,
    private readonly _swal: SwalService,
  ) { }

  statusList = statusListData;
  tipoRuleList = tipoRuleListData;
  
 

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      numero: ["RN-04", [Validators.required, Validators.min(1)]],
      descripcion: ["", [Validators.required, Validators.min(1)]],
      tipo: [1, [Validators.required, Validators.min(1)]],
      file: ["", [Validators.required, Validators.min(1)]],
      ocupaciones: ["", [Validators.required, Validators.min(1)]],
      useArea : [false, [Validators.required]],
      tipoSelected: [null, []],
    })
    this.form.get('numero')!.disable();
    this.form.get('descripcion')!.disable();
    this.form.get('tipo')!.disable();
 
  }


 
 


}

