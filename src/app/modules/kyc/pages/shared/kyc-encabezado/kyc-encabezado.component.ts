import { Component, Input, OnInit } from '@angular/core';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { KycEncabezadoService } from '../../../services/kyc-encabezado.service';
 

@Component({
  selector: 'app-kyc-encabezado',
  templateUrl: './kyc-encabezado.component.html',
  styleUrls: ['./kyc-encabezado.component.scss'],
})
export class KycEncabezadoComponent implements OnInit {
  @Input()
  public folio!: string;

  header: IKycEncabezado = <IKycEncabezado>{
    folio: '987222',
    nombres: 'Maria Alejandra',
    apellidos: 'Pascual Pascual',
    tipoSolicitud: 'Nueva',
    fechaSolicitud: '12/04/2024',
    edad: "34 años",
    tipoProducto: 'Hipoteca Santander',
    montoCrediticio: "1,000,000.00",
    estatus: 'Revision',
    estapas: 'Teccnico, Analisis, Aprobacion, Firma, Desembolso',
  };
  mostrarDetalle: boolean = false;

  constructor(
    private readonly notifierService: NotifierService,
    private readonly encabezadoService: KycEncabezadoService
  ) {}

  ngOnInit(): void {
    // this.encabezadoService.getInfoGeneralByFolio(this.folio).subscribe({
    //   next: (response: IResponse<any>) => {
    //     if (response.success) this.header = response.data;
    //     else console.error(response.message);
    //   },
    //   error: (err) => this.notifierService.error(err?.error?.message),
    // });
  }
}

export interface IKycEncabezado {
  folio: string;
  nombres: string;
  apellidos: string;
  tipoSolicitud: string;
  fechaSolicitud: string;
  edad: string;
  tipoProducto: string;
  montoCrediticio: string;
  estatus: string;
  estapas: string;
}