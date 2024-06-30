import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';
import { EKycEstatusActividad } from 'src/app/modules/administracion/helpers/enums/kyc-estatus-actividad.enum';
import { IKycFlujoConsulta } from '../../core/helpers/interfaces/kyc-flujo-consulta';
import { IKycEncabezado } from '../helpers/interfaces/kyc-encabezado.enum';
import { IFlujoConsulta } from '../helpers/interfaces/kyc-flujo-consulta';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { KycWorkFlowActividadService } from '../../../services/kyc-workflow-actividad.service';
import { IKycWorkflowDetalle } from '../../core/helpers/interfaces/kyc-workflow';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { IBandejaPaginate } from '../../core/helpers/interfaces/bandeja';
import { Observable, firstValueFrom, map, of } from 'rxjs';

@Component({
  selector: 'app-kyc-flujo-consulta',
  templateUrl: './kyc-flujo-consulta.component.html',
  styleUrls: ['./kyc-flujo-consulta.component.scss'],
})
export class KycFlujoConsultaComponent implements OnInit {
  @Input()
  public flujoConsulta!: IKycFlujoConsulta;

  header: IKycEncabezado = <IKycEncabezado>{};
  mostrarDetalle: boolean = false;

  flujos: Array<IFlujoConsulta> = [];
  flujoContactoTelefonico: IFlujoConsulta = <IFlujoConsulta>{};
  flujoContactoAseguradora: IFlujoConsulta = <IFlujoConsulta>{};
  userSession!: IUserStorageUserDto;
  folio!: IBandejaPaginate;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private workFlowActividadService: KycWorkFlowActividadService,
    private userStorageService: UserStorageService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createFlujoActividad();
    this.userSession = this.userStorageService.getCurrentUserInfo();
  }

  async createFlujoActividad() {
    // Si la última actividad es 0 = FIN,
    // mostramos CONFIRMACION_ENTREGA como actividad final y estado finalizado

    if (this.flujoConsulta.ultimaActividadActual === 0) {
      this.flujoConsulta.ultimaActividadActual =
        KYCEActividad.CONFIRMACION_ENTREGA;
      this.flujoConsulta.ultimaActividadEstatus =
        EKycEstatusActividad.FINALIZADA;
    }

    const actividades = [
      {
        actividad: KYCEActividad.SOLICITUD,
        path: 'solicitud',
        nombre: 'Solicitud',
      },
      {
        actividad: KYCEActividad.CARGA_DOCUMENTAL,
        path: 'carga_documental',
        nombre: 'Carga documental',
      },
      {
        actividad: KYCEActividad.VALIDACION_DIGITAL,
        path: 'validacion_digital',
        nombre: 'Validación documental',
      },
      {
        actividad: KYCEActividad.FIRMA_CLIENTE,
        path: 'firma_cliente',
        nombre: 'Firma documental',
      },
      {
        actividad: KYCEActividad.FIRMA_EJECUTIVO,
        path: 'firma_ejecutivo',
        nombre: 'Firma ejecutivo',
      },
      {
        actividad: KYCEActividad.VALIDACION_FIRMAS,
        path: 'validacion_firmas',
        nombre: 'Validación de firmas',
      },
      {
        actividad: KYCEActividad.CONFIRMACION_ENTREGA,
        path: 'confirmacion_entrega',
        nombre: 'Confirmación de entrega',
      },
    ];

    const actividadesFlujo: Array<IFlujoConsulta> = [];

    const iconosAmarillos: Array<EKycEstatusActividad> = [
      EKycEstatusActividad.NUEVA,
      EKycEstatusActividad.EN_PROGRESO,
      EKycEstatusActividad.SUSPENDIDA,
      EKycEstatusActividad.EN_REPROCESO,
      EKycEstatusActividad.PROGRAMADA,
    ];

    const iconosVerdes: Array<EKycEstatusActividad> = [
      EKycEstatusActividad.COMPLETADA,
      EKycEstatusActividad.FINALIZADA,
      EKycEstatusActividad.CANCELADA,
    ];

    for (let a = 0; a < actividades.length; a++) {
      const act = actividades[a];
      const observable = this.validateExistenceActivity(act.actividad);
      const actividadExiste = await firstValueFrom(observable);
      
      let estatus: string;

      if (actividadExiste) {
        estatus =
          act.actividad < this.flujoConsulta.ultimaActividadActual
            ? 'completed'
            : act.actividad === this.flujoConsulta.ultimaActividadActual
            ? iconosVerdes.includes(this.flujoConsulta.ultimaActividadEstatus)
              ? 'completed'
              : iconosAmarillos.includes(this.flujoConsulta.ultimaActividadEstatus)
              ? 'inprogress'
              : 'notstarted'
            : 'notstarted';
      } else {
        estatus = 'notstarted';
      }
    
      const wkfFind = {
        ...act,
        estatus: estatus,
      };
    
      actividadesFlujo.push(wkfFind);
    }

    //Actividades opcionales
    const contactoTelefonico = {
      actividad: KYCEActividad.CONTACTO_TELEFONICO,
      path: 'contacto_telefonico',
      nombre: 'Contacto telefónico',
      estatus: this.flujoConsulta.actividadContactoTelefonicoEstatus
        ? iconosVerdes.includes(
            this.flujoConsulta.actividadContactoTelefonicoEstatus
          )
          ? 'completed'
          : 'inprogress'
        : 'notstarted',
    };

    const contactoAseguradora = {
      actividad: KYCEActividad.CONTACTO_ASEGURADORA,
      path: 'contacto_aseguradora',
      nombre: 'Contacto aseguradora',
      estatus: this.flujoConsulta.actividadContactoAseguradoraEstatus
        ? iconosVerdes.includes(
            this.flujoConsulta.actividadContactoAseguradoraEstatus
          )
          ? 'completed'
          : 'inprogress'
        : 'notstarted',
    };

    this.flujos = actividadesFlujo;
    this.flujoContactoTelefonico = contactoTelefonico;
    this.flujoContactoAseguradora = contactoAseguradora;
  }

  onClickActividad(flujo: IFlujoConsulta): void {
    const paths = [
      { actividad: KYCEActividad.SOLICITUD, path: 'solicitud' },
      { actividad: KYCEActividad.CARGA_DOCUMENTAL, path: 'carga-documental' },
      {
        actividad: KYCEActividad.VALIDACION_DIGITAL,
        path: 'validacion-digital',
      },
      { actividad: KYCEActividad.FIRMA_CLIENTE, path: 'firma-cliente' },
      { actividad: KYCEActividad.FIRMA_EJECUTIVO, path: 'firma-ejecutivo' },
      { actividad: KYCEActividad.VALIDACION_FIRMAS, path: 'validacion-firma' },
      {
        actividad: KYCEActividad.CONFIRMACION_ENTREGA,
        path: 'confirmacion-entrega',
      },
      {
        actividad: KYCEActividad.CONTACTO_TELEFONICO,
        path: 'contacto-telefonico',
      },
      {
        actividad: KYCEActividad.CONTACTO_ASEGURADORA,
        path: 'contacto-aseguradora',
      },
    ];

    const goActividad = paths.find((p) => p.actividad === flujo.actividad);

    if (goActividad && ['completed', 'inprogress'].includes(flujo.estatus))
      this.router.navigate(
        [`/${goActividad.path}/`, this.flujoConsulta.folio],
        {
          state: { readonlyModule: true },
        }
      );

    if(flujo.actividad == KYCEActividad.CARGA_DOCUMENTAL && flujo.estatus == "notstarted"){
      this.notifierService.info("Documentación cargada vía Carga documental masiva");
    }
  }

  validateExistenceActivity(actividadCodigo: number): Observable<boolean> {
    const idFolio = this.route.snapshot.paramMap.get('id') || undefined;
    if (!idFolio) return of(false);
  
    return this.workFlowActividadService
      .getActividadByFolioAndActividad(idFolio, actividadCodigo)
      .pipe(
        map((response: IResponse<IKycWorkflowDetalle>) => {
          if (response.success && !Array.isArray(response.data)) {
            return true;
          } else {
            return false;
          }
        })
      );
  }
}
