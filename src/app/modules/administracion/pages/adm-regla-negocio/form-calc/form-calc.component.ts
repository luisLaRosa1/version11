import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-form-calc',
  templateUrl: './form-calc.component.html',
  styleUrls: ['./form-calc.component.scss']
})
export class FormCalcComponent {
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cartInput') cartInput!: ElementRef<HTMLInputElement>;

  statusSelected = new FormControl<string>("ACTIVE");
  statusList = [
    {
      value: 'ALL',
      label: 'Apple',
    },
    {
      value: 'ACTIVE',
      label: 'Lemon',
    },
    {
      value: 'INACTIVE',
      label: 'Orange',
    },
  ];


  fruitCtrl = new FormControl('');
  cartCtrl = new FormControl('');

  arrayForm: string[] = [];

  allFruits: string[] = ['Peso', 'Estatura', 'Producto', 'Reaseguro'];
  allCart: string[] = ['IMC','Área del triangulo', 'Área del cuadrado'];
  


  data: Array<any> = [
    { tipo: "IMC", formula: 'peso * estatura' },
    { tipo: "Cumulo", formula: 'producto * reasegurado' }, 
  ];
  displayedColumns: string[] = [
    'tipo',
    'formula',
    'action',
  ];

  constructor(private readonly liveAnnouncer: LiveAnnouncer) {}

  remove(item: string): void {
    const index = this.arrayForm.indexOf(item);
    if (index >= 0) {
      this.arrayForm.splice(index, 1);
      this.liveAnnouncer.announce(`Removed ${item}`);
    }
  }

  selected(value: string, type: string): void {    
    if (type === 'fruit') {
      this.arrayForm.push(value);
      this.fruitInput.nativeElement.value = '';
      this.fruitCtrl.setValue(null);

    } else if (type === 'cart') {
      this.arrayForm.push(value);
      this.cartInput.nativeElement.value = '';
      this.cartCtrl.setValue(null);
      
    }else{
      this.arrayForm.push(value);
    }

    console.log(this.arrayForm);
  }


}
