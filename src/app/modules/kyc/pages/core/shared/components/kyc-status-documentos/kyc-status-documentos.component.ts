import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IConfiguracionDocumentalDocumentos } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { ICargaDocumentalMasivaCatalogs } from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import { IKycDocumentacion } from '../../../helpers/interfaces/kyc-documentacion';

@Component({
  selector: 'app-kyc-status-documentos',
  templateUrl: './kyc-status-documentos.component.html',
  styleUrls: ['./kyc-status-documentos.component.scss'],
})
export class KycEstatusDocumentosComponent{
  @Input() documentos: IKycDocumentacion[] = [];
  @Input() pendientes: number = 0;
}
 