import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material/angular-material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ShareComponentsModule } from 'src/app/shared/views/components/share-components.module';
import { KycRoutingModule } from './kyc-routing.module';
import { KycBandejasModule } from './pages/core/kyc-bandejas/kyc-bandejas.module';
import { KycBusquedaComponent } from './pages/core/kyc-busqueda/kyc-busqueda.component';
import { KycCargaDocumentalMasivaComponent } from './pages/core/kyc-carga-documental-masiva/kyc-carga-documental-masiva.component';
import { KycCargaDocumentalComponent } from './pages/core/kyc-carga-documental/kyc-carga-documental.component';
import { KycConfirmacionEntregaComponent } from './pages/core/kyc-confirmacion-entrega/kyc-confirmacion-entrega.component';
import { KycContactoAseguradoraComponent } from './pages/core/kyc-contacto-aseguradora/kyc-contacto-aseguradora.component';
import { KycContactoTelefonicoComponent } from './pages/core/kyc-contacto-telefonico/kyc-contacto-telefonico.component';
import { KycHistorialContactoTelefonicoComponent } from './pages/core/kyc-contacto-telefonico/kyc-historial-contacto-telefonico/kyc-historial-contacto-telefonico.component';
import { KycFirmaClienteComponent } from './pages/core/kyc-firma-cliente/kyc-firma-cliente.component';
import { KycFirmaEjecutivoComponent } from './pages/core/kyc-firma-ejecutivo/kyc-firma-ejecutivo.component';
import { KycFolioEstatusDetailsComponent } from './pages/core/kyc-folio/kyc-folio-estatus-details/kyc-folio-estatus-details.component';
import { KycFolioEstatusComponent } from './pages/core/kyc-folio/kyc-folio-estatus/kyc-folio-estatus.component';
import { KycFolioComponent } from './pages/core/kyc-folio/kyc-folio.component';
import { KycListaNegraComponent } from './pages/core/kyc-lista-negra/kyc-lista-negra.component';
import { KycSolicitudComponent } from './pages/core/kyc-solicitud/kyc-solicitud.component';
import { KycValidacionDigitalComponent } from './pages/core/kyc-validacion-digital/kyc-validacion-digital.component';
import { KycValidacionFirmaComponent } from './pages/core/kyc-validacion-firma/kyc-validacion-firma.component';
import { KycInfoTelefonoCorrespondenciaComponent } from './pages/core/shared/components/kyc-info-telefono-correspondencia/kyc-info-telefono-correspondencia.component';
import { KycModalTelefonoCorrespondenciaComponent } from './pages/core/shared/components/kyc-modal-telefono-correspondencia/kyc-modal-telefono-correspondencia.component';
import { KycSharedChecklistComponent } from './pages/core/shared/components/kyc-shared-checklist/kyc-shared-checklist.component';
import { KycSharedUploadComponent } from './pages/core/shared/components/kyc-shared-upload/kyc-shared-upload.component';
import { KycEstatusDocumentosComponent } from './pages/core/shared/components/kyc-status-documentos/kyc-status-documentos.component';
import { KycDashboardStatusComponent } from './pages/kyc-dashboard/kyc-dashboard-status/kyc-dashboard-status.component';
import { KycDashboardComponent } from './pages/kyc-dashboard/kyc-dashboard.component';
import { KycEncabezadoBitacoraComponent } from './pages/shared/kyc-encabezado/kyc-encabezado-detalle/kyc-encabezado-bitacora/kyc-encabezado-bitacora.component';
import { KycEncabezadoDetalleComponent } from './pages/shared/kyc-encabezado/kyc-encabezado-detalle/kyc-encabezado-detalle.component';
import { KycEncabezadoExpedienteComponent } from './pages/shared/kyc-encabezado/kyc-encabezado-detalle/kyc-encabezado-expediente/kyc-encabezado-expediente.component';
import { KycEncabezadoHistorialComponent } from './pages/shared/kyc-encabezado/kyc-encabezado-detalle/kyc-encabezado-historial/kyc-encabezado-historial.component';
import { KycEncabezadoComponent } from './pages/shared/kyc-encabezado/kyc-encabezado.component';
import { KycFlujoConsultaComponent } from './pages/shared/kyc-flujo-consulta/kyc-flujo-consulta.component';
import { KycEncabezadoParticipantesComponent } from './pages/shared/kyc-encabezado/kyc-encabezado-detalle/kyc-encabezado-participantes/kyc-encabezado-participantes.component';

@NgModule({
  declarations: [
    KycDashboardComponent,
    KycDashboardStatusComponent,
    KycBusquedaComponent,
    KycFolioComponent,
    KycSolicitudComponent,
    KycCargaDocumentalComponent,
    KycValidacionDigitalComponent,
    KycFirmaClienteComponent,
    KycFirmaEjecutivoComponent,
    KycValidacionFirmaComponent,
    KycConfirmacionEntregaComponent,
    KycContactoTelefonicoComponent,
    KycContactoAseguradoraComponent,
    KycCargaDocumentalMasivaComponent,
    KycSharedChecklistComponent,
    KycSharedUploadComponent,
    KycModalTelefonoCorrespondenciaComponent,
    KycInfoTelefonoCorrespondenciaComponent,
    KycEncabezadoComponent,
    KycFolioEstatusComponent,
    KycFolioEstatusDetailsComponent,
    KycEncabezadoDetalleComponent,
    KycHistorialContactoTelefonicoComponent,
    KycFlujoConsultaComponent,
    KycEstatusDocumentosComponent,
    KycEncabezadoExpedienteComponent,
    KycEncabezadoHistorialComponent,
    KycEncabezadoBitacoraComponent,
    KycListaNegraComponent,
    KycEncabezadoParticipantesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KycRoutingModule,
    KycBandejasModule,
    AngularMaterialModule,
    ShareComponentsModule,
    SharedModule,
  ],
})
export class KycModule {}
