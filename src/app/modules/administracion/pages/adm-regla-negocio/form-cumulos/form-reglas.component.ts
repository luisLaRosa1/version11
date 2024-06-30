import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CatalogViewClustersAPI, ModalConfigDataAPI, formConfigAPI, listCumulosAPI } from './api_data_cumulos';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { IAction, IColumn } from 'src/app/modules/kyc/pages/core/helpers/interfaces/detail-in-table';
import { KycModalTelefonoCorrespondenciaComponent } from 'src/app/modules/kyc/pages/core/shared/components/kyc-modal-telefono-correspondencia/kyc-modal-telefono-correspondencia.component';
import { KycModalComponent } from '../../shared/components/kyc-modal/kyc-modal.component';
import { statusListData, tipoRuleListData } from '../api_datable_reglas';

@Component({
  selector: 'app-form-reglas',
  templateUrl: './form-reglas.component.html',
  styleUrls: ['./form-reglas.component.scss']
})
export class FormReglasComponent implements OnInit{
  breadcrumbs: string[] = ['Administración', 'Cúmulos'];
  dataSource: Subject<CatalogViewClustersAPI[]> = new Subject();
  private EDIT = 'fa-pen';
  private DELETE = 'fa-trash';

  columns: IColumn[] = [
    // { name: 'Nro', property: 'id' },
    { name: 'Descripcion', property: 'description' },
    { name: 'Cumulo producto', property: 'minimumLifeValue' },
    { name: 'Cumulo reaseguro', property: 'maximumLifeValue' },
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

  numberSelected = new FormControl<string>('ACTIVE');
  areaSelected = new FormControl({ value: 1, disabled: false });
  descriptionSelected = new FormControl<number>(0);

  ngOnInit(): void {
    this.getCatalogs();
  }

  getCatalogs(): void {

    setTimeout(() => {
      const data: CatalogViewClustersAPI[] = listCumulosAPI.map(cata => {
        return {
          id: cata.clave,
          description: cata.descripcion,
          edit: '',
          minimumLifeValue: cata.valorMinimoVida ?? 0,
          maximumLifeValue: cata.valorMaximoVida ?? 0,
          minimumAPLifeValue: cata.valorMinimoAPVida ?? 0,
          maximumAPLifeValue: cata.valorMaximoAPVida ?? 0,
          medicalIndicator: cata.indicadorMedico ?? '-',
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
      description: [update ? update.description : '', Validators.required],
      minimumLifeValue: [update ? update.minimumLifeValue : '', Validators.required],
      maximumLifeValue: [update ? update.maximumLifeValue : '', Validators.required],
      minimumAPLifeValue: [update ? update.minimumAPLifeValue : '', Validators.required],
      maximumAPLifeValue: [update ? update.maximumAPLifeValue : '', Validators.required],
      medicalIndicator: [update ? update.medicalIndicator : '', Validators.required],
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
      description: "",
      minimumLifeValue: "",
      maximumLifeValue: [],
      minimumAPLifeValue: null,
      maximumAPLifeValue: "",
      medicalIndicator: 0,
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
          description: form.get('description')?.value as string,
          minimumLifeValue: form.get('minimumLifeValue')?.value as number,
          maximumLifeValue: form.get('maximumLifeValue')?.value as number,
          minimumAPLifeValue: form.get('minimumAPLifeValue')?.value as number,
          maximumAPLifeValue: form.get('maximumAPLifeValue')?.value as number,
          medicalIndicator: form.get('medicalIndicator')?.value as string,
        };

        const valid = Object.entries(dto).some(([key, value]) => Object.getOwnPropertyDescriptor(catalog, key)?.value !== value);

        if(!valid)
          return this._notifierService.warning('Usted debe modificar los campos', 'No hubo cambios');

      }
    });
  }
}

