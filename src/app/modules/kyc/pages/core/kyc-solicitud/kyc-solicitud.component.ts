import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';
import { ICargaDocumentalMasivaCatalogs } from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import { IWorlFlow } from 'src/app/modules/administracion/helpers/interfaces/core-workflow';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { KycEstatusBitacoraConsts } from '../../../helpers/consts/core/kyc-estatus-bitacora.consts';
import { KycComentarioService } from '../../../services/kyc-core-comentario.service';
import { KycWorkFlowService } from '../../../services/kyc-core.workflow.service';
import { KycExpedienteDigitalService } from '../../../services/kyc-expediente-digital.service';
import { KycWorkFlowActividadService } from '../../../services/kyc-workflow-actividad.service';
import { ENotificacion } from '../helpers/enums/notificacion.enum';
import { IBandejaPaginate } from '../helpers/interfaces/bandeja';
import { IKycDocumentacion } from '../helpers/interfaces/kyc-documentacion';
import { IKycWorkflowDetalle } from '../helpers/interfaces/kyc-workflow';

@Component({
  selector: 'app-kyc-solicitud',
  templateUrl: './kyc-solicitud.component.html',
  styleUrls: ['./kyc-solicitud.component.scss'],
})
export class KycSolicitudComponent implements OnInit {
  comentarioLength: number = AppConsts.SETTINGS.VALIDATIONS.LENGTH.Comentario;

  breadcrumbs: string[] = ['Conoce a tu cliente', 'Solicitud'];

  frmComentario = {} as FormGroup;
  IDCOMENTARIO: string | undefined = undefined;
  userSession!: IUserStorageUserDto;
  folio!: IBandejaPaginate;
  catalogos: ICargaDocumentalMasivaCatalogs = {};

  readonlyModule: boolean = false;
  loading: boolean = true;
  documentos: IKycDocumentacion[] = [];
  pendientes: number = 0;
  documentosObligatorios: string[] = [];

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private comentarioService: KycComentarioService,
    private workflowService: KycWorkFlowService,
    private workFlowActividadService: KycWorkFlowActividadService,
    private userStorageService: UserStorageService,
    private expedienteService: KycExpedienteDigitalService,
    private configuracionDocumentalService: AdmConfiguracionDocumentalService,
    private formBuilder: FormBuilder,
    private swalService: SwalService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.frmComentario = this.formBuilder.group({
      folio: ['', [Validators.required]],
      actividad: ['', [Validators.required]],
      titular: ['', [Validators.required]],
      comentarios: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.init();
  }

  init(): void {
    this.userSession = this.userStorageService.getCurrentUserInfo();
    this.readonlyModule = history.state.readonlyModule || false;
    const folio = this.route.snapshot.paramMap.get('id') || undefined;

    if (!folio) {
      this.return();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(folio, KYCEActividad.SOLICITUD)
      .subscribe({
        next: (response: IResponse<IKycWorkflowDetalle>) => {
          if (response.success) {
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;

            this.frmComentario.patchValue({
              folio: this.folio.folio,
              actividad: this.folio.actividadCodigo,
              titular: this.folio.titular,
              comentarios: '',
            });

            this.getComentarios();
            this.getExpediente();
          } else {
            console.error(response.message);
            this.return();
          }
        },
        error: (err) => {
          this.notifierService.warning(err?.error?.message);
          this.return();
        },
      });
  }

  async verificaConfiguracion() {
    const response = await lastValueFrom(
      this.configuracionDocumentalService.getConfiguracionDocumentalByProyecto(
        this.folio.proyecto,
        this.folio.aseguradoraId,
        this.folio.titular
      )
    );
    this.documentos = [];
    response.data.documento.forEach((element) => {
      this.documentos.push({
        documento: element.documento,
        nombre: element.nombre,
        obligatorio: element.obligatorio,
        pendiente: true,
        clave: element.clave,
      });
    });
    return response.data ? true : false;
  }

  async getComentarios() {
    const response = await lastValueFrom(
      this.comentarioService.find(
        this.folio.folio,
        this.folio.actividadCodigo.toString()
      )
    );

    if (response.success && response.data[0]) {
      this.frmComentario.patchValue(response.data[0].actividades);
      this.IDCOMENTARIO = response.data[0]._id;
    }

    if (this.readonlyModule) this.frmComentario.disable();
    this.loading = false;
  }

  async getExpediente() {
    await this.expedienteService.check_by_titular(
      this.folio.pais,
      this.folio.aseguradoraId,
      this.folio.proyecto,
      this.folio.titular
    )
    .subscribe((response) => {
      if (response.success) {
        this.documentosObligatorios = response.data.filter(
          (element: any) =>
            element.clave !== EDocumento.FIC &&
            element.clave !== EDocumento.ANEXO &&
            element.clave !== EDocumento.ACUSE_ENVIO &&
            element.obligatorio
        );
      }
    });
  }

  async saveData() {

    if (this.frmComentario.valid) {
      if (!this.IDCOMENTARIO) {
        this.comentarioService
          .create(this.frmComentario.value)
          .subscribe((response) => {
            const { _id } = response.data;
            this.IDCOMENTARIO = _id;
          });
      }

      const configuracion = await this.verificaConfiguracion();
      if (!configuracion) {
        this.notifierService.warning(
          'Configuración documental no existe, favor de completar.'
        );
        return;
      }

      const documentos_pendientes = this.documentosObligatorios
      if (documentos_pendientes.length > 0) {
        const mensaje = this.generarMensajeHtml(documentos_pendientes);
        this.swalService
          .question({
            html: `Se solicitarán los documentos ${mensaje} ¿Está de acuerdo?`,
          })
          .then((result) => {
            if (result.isConfirmed) {
              const workflow: IWorlFlow = {
                folio: this.folio.folio,
                actividadInicial: this.folio.actividadCodigo,
                actividadFinal: KYCEActividad.CARGA_DOCUMENTAL,
                actividad: KycEstatusBitacoraConsts.PENDIENTE_DE_DOCUMENTACION,
                notificacion: ENotificacion.SOLICITUD,
                comentarios: this.frmComentario.get('comentarios')?.value,
              };
             this.workflowService.avanzar(workflow).subscribe((response) => {
                this.swalService
                  .success({
                    html: 'Información almacenada correctamente, se avanzó la actividad a <b>Carga Documental</b>',
                  })
                  .then(() => {
                    this.router.navigate(['/bandejas']);
                  });
              });
            }
          });
      } else {
        const workflow: IWorlFlow = {
          folio: this.folio.folio,
          actividadInicial: this.folio.actividadCodigo,
          actividadFinal: KYCEActividad.VALIDACION_DIGITAL,
          actividad: KycEstatusBitacoraConsts.EN_PROCESO_DE_GESTION,
          notificacion: 0,
          comentarios: this.frmComentario.get('comentarios')?.value,
        };

        this.workflowService.avanzar(workflow).subscribe((response) => {
          this.swalService
            .success({
              html: 'Información almacenada correctamente, se avanzó la actividad a <b>Validación documental</b>',
            })
            .then(() => {
              this.router.navigate(['/bandejas']);
            });
        });
      }
      // todo: contacto telefonico
    }
  }

  generarMensajeHtml(documentos: any[]): string {
    let mensaje = '';
    mensaje += "<div style='text-align: left'> </br>";
    mensaje += '<ul>';
    documentos.forEach((element: any) => {
      if (
        element.clave !== EDocumento.FIC &&
        element.clave !== EDocumento.ANEXO &&
        element.obligatorio == true
      ) {
        mensaje += '<li>';
        mensaje += element.nombre;
        // mensaje += ` <span style="background-color: white;color: #0eb7e6;font-weight: bold;">${
        //   element.obligatorio ? '(Obligatorio)' : '(No Obligatorio)'
        // }</span>`;
        mensaje += '</li>';
      }
    });
    mensaje += '</ul>';
    mensaje += '</div> </br>';
    return mensaje;
  }

  return(): void {
    this.frmComentario.patchValue({});
    this.router.navigate([
      `/${this.readonlyModule ? 'busquedas' : 'bandejas'}`,
    ]);
  }
}
