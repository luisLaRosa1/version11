import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-carga-masiva-oii',
  templateUrl: './carga-masiva-oii.component.html',
  styleUrls: ['./carga-masiva-oii.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CargaMasivaOiiComponent {
  showForm = false;
  listResponseMedic = [
    {
      value: 'ALL',
      label: 'ACEPTADO CON CLAVE',
    },
    {
      value: 'ACTIVE',
      label: 'RECHAZADO CON CLAVE',
    },
    {
      value: 'INACTIVE',
      label: 'SUSPENSION COVIT 19',
    },
  ];

  search(){
    this.showForm = true;
  }

  cancel(){
    this.showForm = false;
  }
}
