import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AngularMaterialModule } from 'src/app/shared/modules/angular-material/angular-material.module';
import { ShareComponentsModule } from 'src/app/shared/views/components/share-components.module';
import { KycBandejaEntradaComponent } from './kyc-bandeja-entrada/kyc-bandeja-entrada.component';
import { KycBandejaProgramadaComponent } from './kyc-bandeja-programada/kyc-bandeja-programada.component';
import { KycBandejaReprocesoComponent } from './kyc-bandeja-reproceso/kyc-bandeja-reproceso.component';
import { KycBandejaSuspendidaComponent } from './kyc-bandeja-suspendida/kyc-bandeja-suspendida.component';
import { KycBandejasRoutingModule } from './kyc-bandejas-routing.module';
import { PipeModule } from 'src/app/shared/helpers/pipes/pipe.module';

@NgModule({
  declarations: [
    KycBandejaEntradaComponent,
    KycBandejaReprocesoComponent,
    KycBandejaProgramadaComponent,
    KycBandejaSuspendidaComponent
  ],
  imports: [
    CommonModule,
    KycBandejasRoutingModule,
    AngularMaterialModule,
    ShareComponentsModule,
    PipeModule
  ]
})
export class KycBandejasModule { }
