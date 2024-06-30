import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MdlDisabledComponent } from '../mdl-disabled/mdl-disabled.component';
import { CatalogViewClustersAPI, dataEditApi, dataListTarifaAPI } from './api_datable_tarifas';
import { statusListData, tipoRuleListData } from '../api_datable_reglas';
import { IAction, IColumn } from 'src/app/modules/kyc/pages/core/helpers/interfaces/detail-in-table';



@Component({
  selector: 'app-form-tarifas',
  templateUrl: './form-tarifas.component.html',
  styleUrls: ['./form-tarifas.component.scss']
})
export class FormTarifasComponent{

  breadcrumbs = ['Reglas', 'Tarifas'];
  data: Array<any> = [
    { codigo: "0.292", descripcion: '0.14', total: '0.36', accion:"0.9" }, 
  ];
  displayedColumns: string[] = [
    'codigo',
    'descripcion',
    'action',
    'total',
    // 'action2',
  ];

  isLoadingResults = true;
  statusList = statusListData;
  tipoRuleList = tipoRuleListData;
  dataEditList = dataEditApi;
  statusSelected = new FormControl<string>('ACTIVE');
  ruleTypeSelected = new FormControl<number>(3);
  form!: FormGroup;

  dataSource: Subject<CatalogViewClustersAPI[]> = new Subject();
  private EDIT = 'fa-pen';


  
  

  constructor(
    private router: Router,
    private readonly _formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {

  }



  ngOnInit(): void {
  

    this.form = this._formBuilder.group({
      nTarifas: ["", [Validators.required, Validators.min(1)]],
      tarifaTitular: ["", [Validators.required, Validators.min(1)]],
      tarifa1:["", [Validators.required, Validators.min(1)]],
      tarifa2:["", [Validators.required, Validators.min(1)]],
      tarifa3:["", [Validators.required, Validators.min(1)]],
      tarifa4:["", [Validators.required, Validators.min(1)]],
      total:["", [Validators.required, Validators.min(1)]],
      useArea:[false, [Validators.required]],
      tipoSelected: [null, [Validators.required]],
    });

    

    setTimeout(() => {
      const data: CatalogViewClustersAPI[] = dataListTarifaAPI.map(cata => {
        return {
          _id: cata._id,
          fallecimiento: cata.fallecimiento,
          desempleo: cata.desempleo ?? 0,
          invalidez: cata.invalidez ?? 0,
          total: cata.total ?? 0,
          edit: '',
        };
      });
  
      this.dataSource.next(data);
    }, 2000);

  }

  onAction(catalog: CatalogViewClustersAPI & IAction): void {
    if(catalog.iconName.includes(this.EDIT)){

    }
  }

  // submit(change:boolean){
  //   this.showFormMain = true;
  //   this.showDatable = false;

  //   if(change){
  //     this.showFormMain = true;
  //     this.showDatable = false;  
  //   }

  //   if(this.form.valid){
  //     this.showFormMain = false;
  //     this.showDatable = true;
  //   }
  // }

  editar(){
    this.form.setValue(this.dataEditList);
  }
}
