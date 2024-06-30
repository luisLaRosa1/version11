import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { IAction, IColumn } from 'src/app/modules/kyc/pages/core/helpers/interfaces/detail-in-table';
import { KycModalTelefonoCorrespondenciaComponent } from 'src/app/modules/kyc/pages/core/shared/components/kyc-modal-telefono-correspondencia/kyc-modal-telefono-correspondencia.component';
import { KycModalComponent } from '../../shared/components/kyc-modal/kyc-modal.component';
import { statusListData, tipoRuleOcupacionListData, tipoRuleExamenMedicoListData } from '../api_datable_reglas';

@Component({
  selector: 'app-form-examen-medico',
  templateUrl: './form-examen-medico.component.html',
  styleUrls: ['./form-examen-medico.component.scss']
})
export class FormExamenMedicoComponent implements OnInit{
  breadcrumbs: string[] = ['Administración', 'Parametrizar Examen Medico'];
  data: Array<any> = [{ codigo: 1, descripcion: 'Abarrotero (Propietario/empleado) ', accion:"Happy path" }, {  codigo: 2, descripcion: 'Agente Judicial', accion:"Rechazo automatico" } ];
  private EDIT = 'fa-pen';
  private DELETE = 'fa-trash';
  form!: UntypedFormGroup;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _notifierService: NotifierService,
    private readonly _formBuilder: FormBuilder,
    private readonly _swal: SwalService,
  ) { }

  statusList = statusListData;
  tipoRuleList = tipoRuleOcupacionListData;
  tipoExamenList= tipoRuleExamenMedicoListData;
 

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      numero: ["", [Validators.required, Validators.min(1)]],
      descripcion: ["", [Validators.required, Validators.min(1)]],
      file: ["", [Validators.required, Validators.min(1)]],
      ocupaciones: ["", [Validators.required, Validators.min(1)]],
    })

 
  }


 
 


}

