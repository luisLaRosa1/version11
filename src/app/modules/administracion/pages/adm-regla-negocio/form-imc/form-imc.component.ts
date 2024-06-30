import { Component, OnInit } from '@angular/core';
import { statusListData, tipoRuleListData } from '../api_datable_reglas';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ModalConfigDataAPI } from '../form-cumulos/api_data_cumulos';
import { IAction, IColumn } from 'src/app/modules/kyc/pages/core/helpers/interfaces/detail-in-table';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { KycModalComponent } from '../../shared/components/kyc-modal/kyc-modal.component';
import { CatalogViewClustersAPI, formConfigAPI, listCumulosAPI } from './api_data_imc';

@Component({
  selector: 'app-form-imc',
  templateUrl: './form-imc.component.html',
  styleUrls: ['./form-imc.component.scss']
})
export class FormImcComponent implements OnInit{
    breadcrumbs = ['BRMS', 'Reglas'];
    dataSource: Subject<CatalogViewClustersAPI[]> = new Subject();
    private EDIT = 'fa-pen';
    private DELETE = 'fa-trash';

    columns: IColumn[] = [
      // { name: 'Nro', property: 'id' },
      { name: 'Valor base 1', property: 'valorBase1' },
      { name: 'Comparación 1', property: 'comparacion1' },
      { name: 'Valor base 2', property: 'valorBase2' },
      { name: 'Comparación 2', property: 'comparacion2' },
      { name: '¿Aplica exámen medico?', property: 'medico' },
      { name: 'Editar', property: 'edit', iconGeneral: `fa-solid ${this.EDIT}`, action: true },
      // { name: 'Eliminar', property: 'delete', iconGeneral: `fa-solid ${this.DELETE}`, action: true },
    ];
  
    constructor(
      private readonly _dialog: MatDialog,
      private readonly _notifierService: NotifierService,
      private readonly _formBuilder: FormBuilder,
      private readonly _swal: SwalService,
    ) { }
  
    statusList = statusListData;
    tipoRuleList = tipoRuleListData;
    areaSelected = new FormControl({ value: 2, disabled: true });
  
    numberSelected = new FormControl<string>('ACTIVE');
    descriptionSelected = new FormControl<number>(0);
  
    ngOnInit(): void {
      setTimeout(() => {
        const data: CatalogViewClustersAPI[] = listCumulosAPI.map(cata => {
          return {
            // id: cata.clave,
            valorBase1: cata.valorBase1Value,
            valorBase2: cata.valorMaximoVida ?? 0,
            comparacion1: cata.comparacion1Value ?? 0,
            comparacion2: cata.comparacion2Value ?? 0,
            edit: '',
            arrive : 'imc',
            maximumAPLifeValue: cata.valorMaximoAPVida ?? 0,
          };
        });
    
        this.dataSource.next(data);
      }, 2000);
    }
  
  
    onOpenDialog(update: CatalogViewClustersAPI, condition:string): void {
      let btnName ="Guardar"
  
      if(condition == "Editar Datos"){
        btnName = "Actualizar";
      }
  
  
      const formGroup = this._formBuilder.group({
        valorBase1Fcn: [update ? update.valorBase1 : '', Validators.required],
        comparacionFcn: [update ? update.comparacion1 : '', Validators.required],
        valorBase2Fcn: [update ? update.valorBase2 : '', Validators.required],
        modalImcFcn: [],
      });
  
      const formConfig = formConfigAPI;
  
      const dataConfig: ModalConfigDataAPI = {
        arrive: 'imc',
        title: condition,
        info: 'Llenar los campos requeridos.',
        buttonOkName: btnName,
        buttonCancelName: 'Cancelar',
        form: {
          config: formConfig,
          group: formGroup,
        },
      };
  
      // console.log(dataConfig);
  
      const dialogRef = this._dialog.open(KycModalComponent, {
        width: '500px',
        data: dataConfig,
      });//Cambiar para el componente modal esta mal XD
  
      dialogRef.afterClosed().subscribe((ok?: boolean) => {
        if(ok)
          this.editCatalog(update, formGroup);
      });
    }
  
    onCreateDialog(condition:string): void {
      let btnName ="Guardar"
  
      if(condition == "Editar Datos"){
        btnName = "Actualizar";
      }
  
  
      const formGroup = this._formBuilder.group({
        valorBase1: "",
        comparacion: "",
        valorBase2: [],
      });
  
      const formConfig = formConfigAPI;
  
      const dataConfig: ModalConfigDataAPI = {
        arrive:null,
        title: condition,
        info: 'Llenar los campos requeridos.',
        buttonOkName: btnName,
        buttonCancelName: 'Cancelar',
        form: {
          config: formConfig,
          group: formGroup,
        },
      };
  
    
      const dialogRef = this._dialog.open(KycModalComponent, {
        width: '500px',
        data: dataConfig,
      });//Cambiar para el componente modal esta mal XD
  
      dialogRef.afterClosed().subscribe((ok?: boolean) => {
          
      });
    }
  
    onAction(catalog: CatalogViewClustersAPI & IAction): void {
      console.log(catalog);
      if(catalog.iconName.includes(this.EDIT))
        return this.onOpenDialog(catalog, "Editar Datos");
    }
  
    editCatalog(catalog: CatalogViewClustersAPI, form: FormGroup): void {
      this._swal.question({
        icon: 'warning',
        html: '¿Está seguro que desea guardar los cambios?',
      }).then((result) => {
        if (result.isConfirmed) {
          const dto = {
            valorBase1Fcn: form.get('valorBase1')?.value as string,
            comparacionFcn: form.get('comparacion')?.value as number,
            valorBase2Fcn: form.get('valorBase2')?.value as number,
          };
  
          const valid = Object.entries(dto).some(([key, value]) => Object.getOwnPropertyDescriptor(catalog, key)?.value !== value);
  
          if(!valid)
            return this._notifierService.warning('Usted debe modificar los campos', 'No hubo cambios');
  
        }
      });
    }
  }
  
  
