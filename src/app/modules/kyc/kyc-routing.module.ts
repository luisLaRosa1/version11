import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from 'src/app/shared/guards/authorize.guard';
import { KycConsts } from './helpers/consts/kyc.consts';
import { KycBusquedaComponent } from './pages/core/kyc-busqueda/kyc-busqueda.component';
import { KycCargaDocumentalMasivaComponent } from './pages/core/kyc-carga-documental-masiva/kyc-carga-documental-masiva.component';
import { KycCargaDocumentalComponent } from './pages/core/kyc-carga-documental/kyc-carga-documental.component';
import { KycConfirmacionEntregaComponent } from './pages/core/kyc-confirmacion-entrega/kyc-confirmacion-entrega.component';
import { KycContactoAseguradoraComponent } from './pages/core/kyc-contacto-aseguradora/kyc-contacto-aseguradora.component';
import { KycContactoTelefonicoComponent } from './pages/core/kyc-contacto-telefonico/kyc-contacto-telefonico.component';
import { KycFirmaClienteComponent } from './pages/core/kyc-firma-cliente/kyc-firma-cliente.component';
import { KycFirmaEjecutivoComponent } from './pages/core/kyc-firma-ejecutivo/kyc-firma-ejecutivo.component';
import { KycFolioEstatusDetailsComponent } from './pages/core/kyc-folio/kyc-folio-estatus-details/kyc-folio-estatus-details.component';
import { KycFolioEstatusComponent } from './pages/core/kyc-folio/kyc-folio-estatus/kyc-folio-estatus.component';
import { KycFolioComponent } from './pages/core/kyc-folio/kyc-folio.component';
import { KycListaNegraComponent } from './pages/core/kyc-lista-negra/kyc-lista-negra.component';
import { KycSolicitudComponent } from './pages/core/kyc-solicitud/kyc-solicitud.component';
import { KycValidacionDigitalComponent } from './pages/core/kyc-validacion-digital/kyc-validacion-digital.component';
import { KycValidacionFirmaComponent } from './pages/core/kyc-validacion-firma/kyc-validacion-firma.component';

const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   title: 'Inicio',
  //   component: KycDashboardComponent,
  // },
  {
    path: 'busquedas',
    title: 'Búsquedas',
    component: KycBusquedaComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.busquedas },
  },
  {
    path: 'folio/nuevo',
    title: 'Nuevo folio',
    component: KycFolioComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.nuevo_folio },
  },
  {
    path: 'folio/estatus-carga',
    title: 'Cargas masivas',
    component: KycFolioEstatusComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.nuevo_folio },
  },
  {
    path: 'folio/carga-documental-masiva',
    title: 'Cargas documental masiva',
    component: KycCargaDocumentalMasivaComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.nuevo_folio },
  },
  {
    path: 'folio/estatus-carga/:header',
    title: 'Detalle de la carga masiva',
    component: KycFolioEstatusDetailsComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.nuevo_folio },
  },
  {
    path: 'solicitud/:id',
    title: 'Solicitud',
    component: KycSolicitudComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.solicitud },
  },
  {
    path: 'carga-documental/:id',
    title: 'Carga documental',
    component: KycCargaDocumentalComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.carga_documental },
  },
  {
    path: 'validacion-digital/:id',
    title: 'Validación digital',
    component: KycValidacionDigitalComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.validacion_digital },
  },
  {
    path: 'firma-cliente/:id',
    title: 'Firma cliente',
    component: KycFirmaClienteComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.firma_cliente },
  },
  {
    path: 'firma-ejecutivo/:id',
    title: 'Firma ejecutivo',
    component: KycFirmaEjecutivoComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.firma_ejecutivo },
  },
  {
    path: 'validacion-firma/:id',
    title: 'Validación de firma',
    component: KycValidacionFirmaComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.validacion_firmas },
  },
  {
    path: 'confirmacion-entrega/:id',
    title: 'Confirmación de entrega',
    component: KycConfirmacionEntregaComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.confirmacion_entrega },
  },
  {
    path: 'contacto-telefonico/:id',
    title: 'Contacto telefónico',
    component: KycContactoTelefonicoComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.contacto_telefonico },
  },
  {
    path: 'contacto-aseguradora/:id',
    title: 'Contacto aseguradora',
    component: KycContactoAseguradoraComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.contacto_aseguradora },
  },
  {
    path: 'lista-negra',
    title: 'Lista negra',
    component: KycListaNegraComponent,
    //canActivate: [AuthorizeGuard],
    data: { permiso: KycConsts.PERMISSIONS.lista_negra },
  },
  {
    path: 'bandejas',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/core/kyc-bandejas/kyc-bandejas.module').then(
            (m) => m.KycBandejasModule
          ),
      },
    ],
  },

  { path: '', redirectTo: 'busquedas', pathMatch: 'full' },
  { path: '**', redirectTo: 'busquedas' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KycRoutingModule {}
