import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface TableOne {
  description: string;
  code: string;
  campaign: string;
  penalty: boolean;
}

export interface TableTwo {
  description: string;
  code: string;
  nacionality: string;
  doesRuleApply: boolean;
}

export interface TableThree {
  description: string;
  code: string;
  countryOfLabor: string;
  doesRuleApply: boolean;
}

const TABLEONE_DATA: TableOne[] = [
  { description:'Campaña es extranjero', code: '1', campaign: 'Extranjero', penalty: false, },
];

const TABLETWO_DATA: TableTwo[] = [
  {description:'Campaña es extranjero' ,code: '1', nacionality: 'Extranjero', doesRuleApply: false, },
  {description:'Campaña es extranjero', code: '2', nacionality: 'Mexicano', doesRuleApply: false, },
];

const TABLETHREE_DATA: TableThree[] = [
  {description:'Campaña es extranjero', code: '1', countryOfLabor: 'Extranjero', doesRuleApply: false, },
];



@Component({
  selector: 'app-form-nacionalidad',
  templateUrl: './form-nacionalidad.component.html',
  styleUrls: ['./form-nacionalidad.component.scss']
})


export class FormNacionalidadComponent {

  form!:FormGroup;

  breadcrumbs: string[] = ['Administración', 'Nacionalidad'];
  tableOneDisplayColumns: string[] = ['code','campaign', 'penalty'];
  tableTwoDisplayColumns: string[] = ['code', 'nacionality', 'doesRuleApply'];
  tableThreeDisplayColumns: string[] = ['code', 'countryOfLabor', 'doesRuleApply'];
  tableOneDatasource = TABLEONE_DATA;
  tableTwoDatasource = TABLETWO_DATA;
  tableThreeDatasource = TABLETHREE_DATA;


  constructor(
    private readonly _formBuilder: FormBuilder,
  ){

  }


  ngOnInit(): void {
  
      this.form = this._formBuilder.group({
        useArea:[false, [Validators.required]],
        tipoSelected: [null, [Validators.required]],
      });

  }
}
