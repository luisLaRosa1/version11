import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material/angular-material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ShareComponentsModule } from 'src/app/shared/views/components/share-components.module';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { AdmAseguradoraActualizarComponent } from './pages/adm-aseguradora/adm-aseguradora-actualizar/adm-aseguradora-actualizar.component';
import { AdmAseguradoraCrearComponent } from './pages/adm-aseguradora/adm-aseguradora-crear/adm-aseguradora-crear.component';
import { AdmAseguradoraFormComponent } from './pages/adm-aseguradora/adm-aseguradora-form/adm-aseguradora-form.component';
import { AdmAseguradoraVerComponent } from './pages/adm-aseguradora/adm-aseguradora-ver/adm-aseguradora-ver.component';
import { AdmAseguradoraComponent } from './pages/adm-aseguradora/adm-aseguradora.component';
import { AdmConfiguracionAseguradoraFormComponent } from './pages/adm-configuracion-aseguradora/adm-configuracion-aseguradora-form/adm-configuracion-aseguradora-form.component';
import { AdmConfiguracionAseguradoraComponent } from './pages/adm-configuracion-aseguradora/adm-configuracion-aseguradora.component';
import { AdmConfiguracionDocumentalFormComponent } from './pages/adm-configuracion-documental/adm-configuracion-documental-form/adm-configuracion-documental-form.component';
import { AdmConfiguracionDocumentalTableComponent } from './pages/adm-configuracion-documental/adm-configuracion-documental-form/adm-configuracion-documental-table/adm-configuracion-documental-table.component';
import { AdmConfiguracionDocumentalComponent } from './pages/adm-configuracion-documental/adm-configuracion-documental.component';
import { AdmConfiguracionFirmaCotejoFormComponent } from './pages/adm-configuracion-firma-cotejo/adm-configuracion-firma-cotejo-form/adm-configuracion-firma-cotejo-form.component';
import { AdmConfiguracionFirmaCotejoComponent } from './pages/adm-configuracion-firma-cotejo/adm-configuracion-firma-cotejo.component';
import { AdmDocumentoActualizarComponent } from './pages/adm-documento/adm-documento-actualizar/adm-documento-actualizar.component';
import { AdmDocumentoCrearComponent } from './pages/adm-documento/adm-documento-crear/adm-documento-crear.component';
import { AdmDocumentoFormComponent } from './pages/adm-documento/adm-documento-form/adm-documento-form.component';
import { AdmDocumentoVerComponent } from './pages/adm-documento/adm-documento-ver/adm-documento-ver.component';
import { AdmDocumentoComponent } from './pages/adm-documento/adm-documento.component';
import { AdmProyectoFormComponent } from './pages/adm-proyecto/adm-proyecto-form/adm-proyecto-form.component';
import { AdmProyectoComponent } from './pages/adm-proyecto/adm-proyecto.component';
import { AdmUsuarioFormComponent } from './pages/adm-usuario/adm-usuario-form/adm-usuario-form.component';
import { AdmUsuarioComponent } from './pages/adm-usuario/adm-usuario.component';

import { AdmPerfilComponent } from './pages/adm-perfil/adm-perfil.component';
import { AdmFormatoComponent } from './pages/adm-formato/adm-formato.component';
import { AdmFormatoFormComponent } from './pages/adm-formato/adm-formato-form/adm-formato-form.component';
import { AdmReporteSeguimientoComponent } from './pages/adm-reporte-seguimiento/adm-reporte-seguimiento.component';
import { AdmReglaNegocioComponent } from './pages/adm-regla-negocio/adm-regla-negocio.component';
import { MdlDisabledComponent } from './pages/adm-regla-negocio/mdl-disabled/mdl-disabled.component';
import { FormReglasComponent } from './pages/adm-regla-negocio/form-cumulos/form-reglas.component';
import { KycDetailInTableComponent } from './pages/shared/components/kyc-detail-in-table/kyc-detail-in-table.component';
import { KycModalComponent } from './pages/shared/components/kyc-modal/kyc-modal.component';
import { FormImcComponent } from './pages/adm-regla-negocio/form-imc/form-imc.component';
import { FormTarifasComponent } from './pages/adm-regla-negocio/form-tarifas/form-tarifas.component';
import { FormOcupacionComponent } from './pages/adm-regla-negocio/form-ocupacion/form-ocupacion.component';
import { FormExamenMedicoComponent } from './pages/adm-regla-negocio/form-examen-medico/form-examen-medico.component';
import { FormNacionalidadComponent } from './pages/adm-regla-negocio/form-nacionalidad/form-nacionalidad.component';
import { CargaMasivaQeqComponent } from './pages/adm-regla-negocio/catalogos/carga-masiva-qeq/carga-masiva-qeq.component';
import { CargaMasivaCumulosComponent } from './pages/adm-regla-negocio/catalogos/carga-masiva-cumulos/carga-masiva-cumulos.component';
import { CargaMasivaOiiComponent } from './pages/adm-regla-negocio/catalogos/carga-masiva-oii/carga-masiva-oii.component';
import { FormCalcComponent } from './pages/adm-regla-negocio/form-calc/form-calc.component';

@NgModule({
  declarations: [
    AdmAseguradoraComponent,
    AdmProyectoComponent,
    AdmUsuarioComponent,
    AdmDocumentoComponent,
    AdmConfiguracionDocumentalComponent,
    AdmConfiguracionDocumentalFormComponent,
    AdmConfiguracionDocumentalTableComponent,
    AdmUsuarioFormComponent,
    AdmProyectoFormComponent,
    AdmAseguradoraCrearComponent,
    AdmAseguradoraActualizarComponent,
    AdmAseguradoraVerComponent,
    AdmAseguradoraFormComponent,
    AdmDocumentoCrearComponent,
    AdmDocumentoActualizarComponent,
    AdmDocumentoVerComponent,
    AdmDocumentoFormComponent,
    AdmConfiguracionAseguradoraComponent,
    AdmConfiguracionAseguradoraFormComponent,
    AdmConfiguracionFirmaCotejoComponent,
    AdmConfiguracionFirmaCotejoFormComponent,
    AdmPerfilComponent,
    AdmFormatoComponent,
    AdmFormatoFormComponent,
    AdmReporteSeguimientoComponent,
    AdmReglaNegocioComponent,
    MdlDisabledComponent,
    FormReglasComponent,
    KycDetailInTableComponent,
    KycModalComponent,
    FormImcComponent,
    FormTarifasComponent,
    FormOcupacionComponent,
    FormExamenMedicoComponent,
    FormNacionalidadComponent,
    CargaMasivaQeqComponent,
    CargaMasivaCumulosComponent,
    CargaMasivaOiiComponent,
    FormCalcComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ShareComponentsModule,
    SharedModule,
    NgxGraphModule,
  ],
})
export class AdministracionModule {}
