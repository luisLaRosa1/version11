import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthorizeGuard} from 'src/app/shared/guards/authorize.guard';
import {
  AdmAseguradoraActualizarComponent
} from './pages/adm-aseguradora/adm-aseguradora-actualizar/adm-aseguradora-actualizar.component';
import {
  AdmAseguradoraCrearComponent
} from './pages/adm-aseguradora/adm-aseguradora-crear/adm-aseguradora-crear.component';
import {AdmAseguradoraVerComponent} from './pages/adm-aseguradora/adm-aseguradora-ver/adm-aseguradora-ver.component';
import {AdmAseguradoraComponent} from './pages/adm-aseguradora/adm-aseguradora.component';
import {
  AdmConfiguracionAseguradoraFormComponent
} from './pages/adm-configuracion-aseguradora/adm-configuracion-aseguradora-form/adm-configuracion-aseguradora-form.component';
import {
  AdmConfiguracionAseguradoraComponent
} from './pages/adm-configuracion-aseguradora/adm-configuracion-aseguradora.component';
import {
  AdmConfiguracionDocumentalFormComponent
} from './pages/adm-configuracion-documental/adm-configuracion-documental-form/adm-configuracion-documental-form.component';
import {
  AdmConfiguracionDocumentalComponent
} from './pages/adm-configuracion-documental/adm-configuracion-documental.component';
import {
  AdmConfiguracionFirmaCotejoFormComponent
} from './pages/adm-configuracion-firma-cotejo/adm-configuracion-firma-cotejo-form/adm-configuracion-firma-cotejo-form.component';
import {
  AdmConfiguracionFirmaCotejoComponent
} from './pages/adm-configuracion-firma-cotejo/adm-configuracion-firma-cotejo.component';
import {
  AdmDocumentoActualizarComponent
} from './pages/adm-documento/adm-documento-actualizar/adm-documento-actualizar.component';
import {AdmDocumentoCrearComponent} from './pages/adm-documento/adm-documento-crear/adm-documento-crear.component';
import {AdmDocumentoVerComponent} from './pages/adm-documento/adm-documento-ver/adm-documento-ver.component';
import {AdmDocumentoComponent} from './pages/adm-documento/adm-documento.component';
import {AdmProyectoFormComponent} from './pages/adm-proyecto/adm-proyecto-form/adm-proyecto-form.component';
import {AdmProyectoComponent} from './pages/adm-proyecto/adm-proyecto.component';
import {AdmUsuarioFormComponent} from './pages/adm-usuario/adm-usuario-form/adm-usuario-form.component';
import {AdmUsuarioComponent} from './pages/adm-usuario/adm-usuario.component';

import {AdmFormatoFormComponent} from './pages/adm-formato/adm-formato-form/adm-formato-form.component';
import {AdmFormatoComponent} from './pages/adm-formato/adm-formato.component';
import {AdmPerfilComponent} from './pages/adm-perfil/adm-perfil.component';
import {AdmReporteSeguimientoComponent} from "./pages/adm-reporte-seguimiento/adm-reporte-seguimiento.component";
import { AdmReglaNegocioComponent } from './pages/adm-regla-negocio/adm-regla-negocio.component';
import { FormReglasComponent } from './pages/adm-regla-negocio/form-cumulos/form-reglas.component';
import { FormImcComponent } from './pages/adm-regla-negocio/form-imc/form-imc.component';
import { FormTarifasComponent } from './pages/adm-regla-negocio/form-tarifas/form-tarifas.component';
import { FormOcupacionComponent } from './pages/adm-regla-negocio/form-ocupacion/form-ocupacion.component';
import { FormExamenMedicoComponent } from './pages/adm-regla-negocio/form-examen-medico/form-examen-medico.component';
import { FormNacionalidadComponent } from './pages/adm-regla-negocio/form-nacionalidad/form-nacionalidad.component';
import { CargaMasivaQeqComponent } from './pages/adm-regla-negocio/catalogos/carga-masiva-qeq/carga-masiva-qeq.component';
import { CargaMasivaOiiComponent } from './pages/adm-regla-negocio/catalogos/carga-masiva-oii/carga-masiva-oii.component';
import { CargaMasivaCumulosComponent } from './pages/adm-regla-negocio/catalogos/carga-masiva-cumulos/carga-masiva-cumulos.component';
import { FormCalcComponent } from './pages/adm-regla-negocio/form-calc/form-calc.component';

const routes: Routes = [
  {
    path: 'aseguradoras',
    title: 'Aseguradoras',
    component: AdmAseguradoraComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-aseguradoras'},
  },
  {
    path: 'aseguradoras/crear',
    title: 'Crear aseguradora',
    component: AdmAseguradoraCrearComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-aseguradoras'},
  },
  {
    path: 'aseguradoras/actualizar/:id',
    title: 'Editar aseguradora',
    component: AdmAseguradoraActualizarComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-aseguradoras'},
  },
  {
    path: 'aseguradoras/ver/:id',
    title: 'Ver aseguradora',
    component: AdmAseguradoraVerComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-aseguradoras'},
  },
  {
    path: 'proyectos',
    title: 'Proyectos',
    component: AdmProyectoComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-proyectos'},
  },
  {
    path: 'proyectos/crear',
    title: 'Crear proyecto',
    component: AdmProyectoFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-proyectos'},
  },

  // {
  //   path: 'proyectos/crear',
  //   title: 'Crear proyecto',
  //   component: AdmProyectoFormComponent,
  //   //canActivate: [AuthorizeGuard],
  //   data: { permiso: 'adm-proyectos' },
  // },

  {
    path: 'reportes',
    title: 'Reportes',
    component: AdmReporteSeguimientoComponent
  },
  {
    path: 'proyectos/actualizar/:id',
    title: 'Editar proyecto',
    component: AdmProyectoFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-proyectos'},
  },
  {
    path: 'proyectos/ver/:id',
    title: 'Ver proyecto',
    component: AdmProyectoFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-proyectos'},
  },
  {
    path: 'usuarios',
    title: 'Usuarios',
    component: AdmUsuarioComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-usuarios'},
  },
  {
    path: 'usuarios/crear',
    title: 'Crear usuario',
    component: AdmUsuarioFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-usuarios'},
  },
  {
    path: 'usuarios/actualizar/:id',
    title: 'Editar usuario',
    component: AdmUsuarioFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-usuarios'},
  },
  {
    path: 'usuarios/ver/:id',
    title: 'Ver usuario',
    component: AdmUsuarioFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-usuarios'},
  },
  {
    path: 'documentos',
    title: 'Documentos',
    component: AdmDocumentoComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-documentos'},
  },
  {
    path: 'documentos/crear',
    title: 'Crear documento',
    component: AdmDocumentoCrearComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-documentos'},
  },
  {
    path: 'documentos/actualizar/:id',
    title: 'Editar documento',
    component: AdmDocumentoActualizarComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-documentos'},
  },
  {
    path: 'documentos/ver/:id',
    title: 'Ver documento',
    component: AdmDocumentoVerComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-documentos'},
  },
  {
    path: 'configuracion-documental',
    title: 'Configuración documental',
    component: AdmConfiguracionDocumentalComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'configuracion-documental/crear',
    title: 'Crear configuración documental',
    component: AdmConfiguracionDocumentalFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'configuracion-documental/actualizar/:id',
    title: 'Editar configuración documental',
    component: AdmConfiguracionDocumentalFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'configuracion-documental/ver/:id',
    title: 'Ver configuración documental',
    component: AdmConfiguracionDocumentalFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'configuracion-aseguradora',
    title: 'Configuración de aseguradoras',
    component: AdmConfiguracionAseguradoraComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-aseguradora'},
  },
  {
    path: 'configuracion-aseguradora/crear',
    title: 'Crear configuración aseguradora',
    component: AdmConfiguracionAseguradoraFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-aseguradora'},
  },
  {
    path: 'configuracion-aseguradora/actualizar/:id',
    title: 'Editar configuración aseguradora',
    component: AdmConfiguracionAseguradoraFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-aseguradora'},
  },
  {
    path: 'configuracion-aseguradora/ver/:id',
    title: 'Ver configuración aseguradora',
    component: AdmConfiguracionAseguradoraFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-aseguradora'},
  },
  {
    path: 'configurador-firma-contejo',
    title: 'Configurador de firma cotejo',
    component: AdmConfiguracionFirmaCotejoComponent,
  },
  {
    path: 'configurador-firma-contejo/crear',
    component: AdmConfiguracionFirmaCotejoFormComponent,
  },
  {
    path: 'configurador-firma-contejo/:id/:operation',
    component: AdmConfiguracionFirmaCotejoFormComponent,
  },
  {
    path: 'perfil',
    title: 'Perfil',
    component: AdmPerfilComponent,
  },
  {
    path: 'formatos',
    title: 'Formatos KYC',
    component: AdmFormatoComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'formatos'},
  },
  {
    path: 'formatos/crear',
    title: 'Crear formatos KYC',
    component: AdmFormatoFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'formatos'},
  },
  {
    path: 'formatos/ver/:id',
    title: 'Ver formatos KYC',
    component: AdmFormatoFormComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'formatos'},
  },
  {
    path: 'regla-negocios',
    title: 'Regla Negocios',
    component: AdmReglaNegocioComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'regla-negocios/editar/:id',
    title: 'Editar Regla',
    component: FormReglasComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'imc/editar/:id',
    title: 'Editar IMC',
    component: FormImcComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'regla-negocios/ocupacion',
    title: 'Editar Regla',
    component: FormOcupacionComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'regla-negocios/nacionalidad',
    title: 'Editar Nacionalidad',
    component: FormNacionalidadComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'tarifas/editar/:id',
    title: 'Editar Tarifas',
    component: FormTarifasComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'regla-negocios/examen-medico',
    title: 'Editar Regla',
    component: FormExamenMedicoComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'regla-negocios/catalogos/carga-masiva-qeq',
    title: 'Carga masiva QEQ',
    component: CargaMasivaQeqComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'regla-negocios/catalogos/carga-masiva-oii',
    title: 'Carga masiva OII',
    component: CargaMasivaOiiComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'regla-negocios/catalogos/carga-masiva-cumulos',
    title: 'Carga masiva cumulos',
    component: CargaMasivaCumulosComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {
    path: 'regla-negocios/calculadora',
    title: 'Calculadora',
    component: FormCalcComponent,
    //canActivate: [AuthorizeGuard],
    data: {permiso: 'adm-configuracion-documental'},
  },
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionRoutingModule {
}
