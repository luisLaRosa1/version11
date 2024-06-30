import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from 'src/app/shared/guards/authorize.guard';
import { KycConsts } from '../../../helpers/consts/kyc.consts';
import { KycBandejaEntradaComponent } from './kyc-bandeja-entrada/kyc-bandeja-entrada.component';
import { KycBandejaProgramadaComponent } from './kyc-bandeja-programada/kyc-bandeja-programada.component';
import { KycBandejaReprocesoComponent } from './kyc-bandeja-reproceso/kyc-bandeja-reproceso.component';
import { KycBandejaSuspendidaComponent } from './kyc-bandeja-suspendida/kyc-bandeja-suspendida.component';

const routes: Routes = [
  {
    path: 'entradas',
    title: 'Bandeja de entradas',
    component: KycBandejaEntradaComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.bandeja_entradas },
  },
  {
    path: 'reprocesos',
    title: 'Bandeja de reprocesos',
    component: KycBandejaReprocesoComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.bandeja_reprocesos },
  },
  {
    path: 'suspendidas',
    title: 'Bandeja de suspendidas',
    component: KycBandejaSuspendidaComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.bandeja_suspendidas },
  },
  {
    path: 'programadas',
    title: 'Bandeja de programadas',
    component: KycBandejaProgramadaComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.bandeja_programadas },
  },
  { path: '', redirectTo: 'entradas', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KycBandejasRoutingModule {}
