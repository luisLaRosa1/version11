import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';
import { EKycEstatusActividad } from 'src/app/modules/administracion/helpers/enums/kyc-estatus-actividad.enum';
import { EMotivoRechazo } from 'src/app/modules/administracion/helpers/enums/kyc-motivo-rechazo.enum';
import { IConfiguracionDocumentalCatalogs } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { IValidacionDigital } from 'src/app/modules/administracion/helpers/interfaces/core-validacion-documental';
import { IWorlFlow } from 'src/app/modules/administracion/helpers/interfaces/core-workflow';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { WorkFlowService } from 'src/app/modules/administracion/services/core.workflow.service';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { AppConsts } from 'src/app/shared/AppConsts';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { KycEstatusBitacoraConsts } from '../../../helpers/consts/core/kyc-estatus-bitacora.consts';
import { KycComentarioService } from '../../../services/kyc-core-comentario.service';
import { KycFirmaEjecutivoService } from '../../../services/kyc-core-firma-ejecutivo.service';
import { KycValidacionFirmasService } from '../../../services/kyc-core-validacion-firmas.service';
import { KycExpedienteDigitalService } from '../../../services/kyc-expediente-digital.service';
import { KycWorkFlowActividadService } from '../../../services/kyc-workflow-actividad.service';
import { ENotificacion } from '../helpers/enums/notificacion.enum';
import { IBandejaPaginate } from '../helpers/interfaces/bandeja';
import { IValidacionFirmasArchivos } from '../helpers/interfaces/kyc-core-validacion-firmas';
import { IKycWorkflowDetalle } from '../helpers/interfaces/kyc-workflow';
import {
  IComentario,
  ISaveComentario,
} from './../../../../administracion/helpers/interfaces/core-comentario';
import { EActividades } from 'src/app/shared/helpers/enums/actividades.enum';

@Component({
  selector: 'app-kyc-validacion-firma',
  templateUrl: './kyc-validacion-firma.component.html',
  styleUrls: ['./kyc-validacion-firma.component.scss'],
})
export class KycValidacionFirmaComponent {
  @ViewChild('formArchivo', { read: NgForm }) formComentario: any;
  comentarioLength: number = AppConsts.SETTINGS.VALIDATIONS.LENGTH.Comentario;

  userSession!: IUserStorageUserDto;
  folio!: IBandejaPaginate;
  validacion: IValidacionDigital = {};

  breadcrumbs: string[] = ['Conoce a tu cliente', 'Validacion de firmas'];
  displayedColumns: string[] = ['document', 'archive', 'check', 'status'];
  idFolio: number = 0;
  lstTodosDocumentos: Array<any> = [];
  ultimoEstatus?: string;
  comentarioRequiere: boolean = true;
  documentosValidacion: Array<any> = [];
  documentosFIC: Array<any> = [];
  currentValidacionId: string = '';
  comentario!: IComentario;
  IDCOMENTARIO: string | undefined = undefined;
  readonlyModule: boolean = false;
  currentActividad!: KYCEActividad;
  currenActividadEstatus!: EKycEstatusActividad;
  motivos: Array<ICatalogo> = [];
  firmaEjecutivo: any = {};
  documentosTitular: Array<any> = [];
  listArchivosValidacion: Array<IValidacionFirmasArchivos> = [];

  constructor(
    private swalService: SwalService,
    private router: Router,
    private notifierService: NotifierService,
    private userStorageService: UserStorageService,
    private workflowService: WorkFlowService,
    private expedienteService: KycExpedienteDigitalService,
    private validacionService: KycValidacionFirmasService,
    public _utils: UtilsService,
    private comentarioService: KycComentarioService,
    private utilsService: UtilsService,
    private workFlowActividadService: KycWorkFlowActividadService,
    private ConfiguracionDocumentalService: AdmConfiguracionDocumentalService,
    private firmaEjecutivoService: KycFirmaEjecutivoService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    const folio = this.route.snapshot.paramMap.get('id') || undefined;
    this.readonlyModule = history.state.readonlyModule || false;
    const actividadCodigo = KYCEActividad.VALIDACION_FIRMAS;

    if (!folio || !actividadCodigo) {
      this.cancelar();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(folio, actividadCodigo)
      .subscribe({
        next: (response: IResponse<IKycWorkflowDetalle>) => {
          if (response.success) {
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;
            this.currentActividad = response.data.actividadCodigo;
            this.currenActividadEstatus = response.data.estatusActividad;

            this.setComentario();
            this.getComentarios(true);
            this.getCatalogs();
            this.getArchivosTitular();
          } else {
            console.error(response.message);
            this.cancelar();
          }
        },
        error: (err) => {
          this.notifierService.warning(err?.error?.message);
          this.cancelar();
        },
      });
  }

  getCatalogs() {
    this.ConfiguracionDocumentalService.getCatalogs().subscribe({
      next: (response: IResponse<IConfiguracionDocumentalCatalogs>) => {
        if (response.success) {
          this.motivos = [
            ...new Set(
              response.data.motivo
                .filter(
                  (element) =>
                    element.clave === 5 ||
                    element.clave === 6 ||
                    element.clave === 7
                )
            ),
          ];
        } else console.error(response.message);
      },
      error: (err) => {
        this.notifierService.error(err?.error?.message);
      },
    });
  }

  setComentario(): void {
    let comentarios: IComentario = {
      folio: this.folio.folio,
      actividades: {
        actividad: this.folio.actividadCodigo,
        comentarios: '',
      },
    };
    this.comentario = comentarios;
  }

  async getComentarios(setForm: boolean) {
    const response = await lastValueFrom(
      this.comentarioService.find(
        this.folio.folio,
        this.folio.actividadCodigo.toString()
      )
    );
    if (response.success && response.data.length > 0) {
      if (setForm)
        this.formComentario.form.controls['comentarios']?.setValue(
          response.data[0].actividades.comentarios
        );
      this.IDCOMENTARIO = response.data[0]._id;
    }
  }

  async getArchivosTitular() {
    const responseArchivos = await lastValueFrom(
      this.expedienteService.find_by_Titular(
        this.folio.pais,
        this.folio.aseguradoraId,
        this.folio.proyecto,
        this.folio.titular
      )
    );

    if (responseArchivos.success) {
      this.documentosTitular = responseArchivos.data;
      this.documentosValidacion = [
        ...new Set(
          responseArchivos.data.filter(
            (element) =>
              //element.categoria === 3 &&
              element.clave !== EDocumento.CONFIRMACION_ENTREGA
          )
        ),
      ];
      this.documentosValidacion.map((x) => {
        if (x.motivos.length == 0) {
          x.motivos = this.motivos;
        }
      });
    }

    this.validacionService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success && response.data !== null) {
            this.validacion = response.data;
            this.currentValidacionId = response.data._id;
            this.documentosValidacion.map((x) => {
              let element: any = x;
              element.correcto = response.data?.archivos.find(
                (element: any) => element.documento == x.documento_id
              )?.correcto;

              this.validacion.archivos?.filter((i) => {
                if (x.documento_id === i.documento) {
                  (x.correcto = i.correcto),
                    (x.idMotivo = i.motivo),
                    (x.id = i.expediente);
                }
              });
            });

            this.documentosValidacion.forEach((x) => {
              const foundIndex = this.listArchivosValidacion.findIndex(
                (i) => i.documento === x.documento_id
              );
              if (foundIndex >= 0) {
                this.listArchivosValidacion[foundIndex].correcto = x.correcto;
                this.listArchivosValidacion[foundIndex].motivo = x.idMotivo;
              }
            });

            this.getFirmEjecutivo();
          }
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
  }

  async getFirmEjecutivo(){
    this.firmaEjecutivoService
    .getByIdAndGetCatalogosToEdit(this.folio.folio)
    .subscribe({
      next: (response: IResponse<any>) => {
        if (response.success && response.data !== null) {
          this.firmaEjecutivo = response.data;
          if (response.data != null) {

            response.data.archivosClasificacion.forEach((x: any) => {

              let documento = this.documentosTitular.find(
                (element: any) => element.documento_id == x.documento
              );

              // if (documento.clave === EDocumento.FIC || documento.clave === EDocumento.ANEXO) {

              //   if (documento.clave === EDocumento.FIC) {
              documento.id = x.expediente
              //   }
              //   if (documento.clave === EDocumento.ANEXO) {
              //     documento.id = x.expediente
              //   }
              this.documentosFIC.push(documento);
              this.listArchivosValidacion.push({ documento: documento.documento_id });
              //}

            });

            this.documentosValidacion = this.documentosValidacion.filter(
              (x) => this.documentosFIC.some((d) => d.clave === x.clave)
            );

            this.documentosValidacion.map((x) => {
              if (x.motivos.length == 0) {
                x.motivos = this.motivos;
              }
            });

            this.indexandoAndPassValue();
          }
        }
      },
      error: (err) => this.notifierService.error(err?.error?.message),
    });
  }

  async click_guardar(docsForm: NgForm) {
    this.documentosValidacion.forEach((element, index) => {
      if (!element.correcto && element.idMotivo == 0) {
        docsForm.form.controls['motivo' + index].setErrors({ incorrect: true });
      }
    });

    if (!docsForm.valid) {
      this.swalService.info({
        html: 'Debe completar los campos requeridos.',
      });
      return;
    }
    this.validacion.folio = this.folio.folio;
    this.validacion.archivos = this.listArchivosValidacion;

    if (this.currentValidacionId === '') {
      this.validacion.folio = this.folio.folio;
      this.validacionService
        .create(this.validacion)
        .subscribe((response) => { });
    } else {
      this.validacionService
        .update(this.currentValidacionId, this.validacion)
        .subscribe((response) => { });
    }

    const dataForComentary: ISaveComentario = {
      folio: this.folio.folio,
      comentarios: docsForm.control.get('comentarios')?.value,
      actividad: this.folio.actividadCodigo,
    };

    await this.getComentarios(false);

    if (this.IDCOMENTARIO == undefined) {
      this.comentarioService.create(dataForComentary).subscribe((response) => {
        const { _id } = response.data;
        this.IDCOMENTARIO = _id;
      });
    } else {
      this.comentario.actividades.comentarios = dataForComentary.comentarios;
      this.comentarioService
        .update(`${this.folio.folio}`, this.comentario)
        .subscribe((response) => { });
    }
    if (this.documentosValidacion.filter((x) => !x.correcto).length > 0) {
      let workflow: IWorlFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal: 0,
        actividad: KycEstatusBitacoraConsts.NONE,
        notificacion: 0,
        reproceso: true,
        comentarios: docsForm.control.get('comentarios')?.value,
      };

      if (this.documentosValidacion.length == 1) {
        const idMotivo = docsForm.control.get(
          `motivo${this.documentosValidacion.length - 1}`
        )?.value;
        const { statusBitacora, idActividad } =
          this.getProcesoYStatusBitacora(idMotivo);
        workflow.actividadFinal = idActividad;
        workflow.actividad = statusBitacora;
        this.reproceso(workflow, idMotivo);
      }

      if (this.documentosValidacion.length > 1) {
        const { statusBitacora, idActividad, idMotivoOutput } =
          this.getProcesoYStatusBitacora(0);
        workflow.actividadFinal = idActividad;
        workflow.actividad = statusBitacora;
        this.reproceso(workflow, idMotivoOutput);
      }
    } else {
      if (!(await this.validaSendFormatosFirmados())) {
        this.swalService.info({
          html: 'Es necesario seleccionar al menos un documento en el <br> <strong>“Expediente digital”</strong> <br> para el envío a la aseguradora',
        });
        return;
      }

      this.swalService.question({
        html: '¿Confirma que ha revisado los documentos seleccionados para enviar a la aseguradora?',
      }).then(responseMessage => {
        if (responseMessage.isConfirmed) {
          const workflow: IWorlFlow = {
            folio: this.folio.folio,
            actividadInicial: this.folio.actividadCodigo,
            actividadFinal: KYCEActividad.CONFIRMACION_ENTREGA,
            actividad: KycEstatusBitacoraConsts.FORMATOS_ENVIADOS_A_ASEGURADORA,
            notificacion: ENotificacion.FORMATOS_FIRMADOS,
            comentarios: docsForm.control.get('comentarios')?.value,
          };

          this.workflowService.avanzar(workflow).subscribe((response) => {
            this.swalService
              .success({
                html: `Información almacenada correctamente, se avanzó la actividad a <b>Confirmación de entrega</b>.`,
              })
              .then(() => {
                this.router.navigate(['/bandejas']);
              });
          });
        }
      })


    }
  }

  getProcesoYStatusBitacora(idMotivo: number) {
    const MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD: any = {
      5: KYCEActividad.VALIDACION_DIGITAL,
      6: KYCEActividad.FIRMA_CLIENTE,
      7: KYCEActividad.FIRMA_EJECUTIVO,
    };

    const MOTIVOS_RECHAZO_STATUS_BITACORA: any = {
      5: KycEstatusBitacoraConsts.CORRECION_DE_FORMATOS,
      6: KycEstatusBitacoraConsts.EN_ESPERA_DE_FIRMA_ASEGURADO,
      7: KycEstatusBitacoraConsts.EN_ESPERA_DE_FIRMA_EJECUTIVO,
    };

    let statusBitacora = '';
    let idActividad = 0;
    let idMotivoOutput = 0;

    if (this.documentosValidacion.length == 1) {
      statusBitacora = MOTIVOS_RECHAZO_STATUS_BITACORA[idMotivo];
      idActividad = MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD[idMotivo];
    }

    if (this.documentosValidacion.length > 1) {
      const idMotivo = this.documentosValidacion[0].idMotivo;
      const idMotivoRechazoUnico = this.documentosValidacion.every(
        (item) => item.idMotivo === idMotivo
      );

      if (idMotivoRechazoUnico) {
        idActividad = MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD[idMotivo];
        statusBitacora = MOTIVOS_RECHAZO_STATUS_BITACORA[idMotivo];
        return { statusBitacora, idActividad, idMotivoOutput: idMotivo };
      }

      if (this.documentosValidacion.filter((x) => !x.correcto).length > 0) {

        const documentoFicRechazo = this.documentosValidacion.filter((x) => !x.correcto && x.clave == EDocumento.FIC
          && [EMotivoRechazo.INFORMACION_INCORRECTA, EMotivoRechazo.FIRMA_INCORRECTA_ASEGURADO].includes(x.idMotivo));

        const documentosCotejoRechazo = this.documentosValidacion.filter((x) => !x.correcto && x.clave != EDocumento.FIC && x.clave != EDocumento.ANEXO);

        if ((documentosCotejoRechazo.length == 0 && documentoFicRechazo.length > 0) || documentoFicRechazo.length > 0 && documentosCotejoRechazo.length > 0) {

          let motivo = this.documentosValidacion.filter((x) => x.clave == EDocumento.FIC && x.idMotivo == EMotivoRechazo.INFORMACION_INCORRECTA).length > 0;
          idActividad = MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD[motivo ? EMotivoRechazo.INFORMACION_INCORRECTA : EMotivoRechazo.FIRMA_INCORRECTA_ASEGURADO];
          statusBitacora = MOTIVOS_RECHAZO_STATUS_BITACORA[motivo ? EMotivoRechazo.INFORMACION_INCORRECTA : EMotivoRechazo.FIRMA_INCORRECTA_ASEGURADO];

        } else {
          return {
            statusBitacora: MOTIVOS_RECHAZO_STATUS_BITACORA[7],
            idActividad: EActividades.FIRMA_EJECUTIVO,
            idMotivoOutput: EMotivoRechazo.FIRMA_INCORRECTA_EJECUTIVO
          };
        }
      } else {
        let idMotivo = this.documentosValidacion
          .filter((x) => !x.correcto)
          .map((x) => x.idMotivo)[0];
        idActividad = MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD[idMotivo];
        statusBitacora = MOTIVOS_RECHAZO_STATUS_BITACORA[idMotivo];
      }

      idMotivoOutput = Number(
        Object.keys(MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD).find((key) => {
          return MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD[key] == idActividad;
        })
      );
    }

    return { statusBitacora, idActividad, idMotivoOutput };
  }

  onChangeCheck(index: number, event: MatSlideToggleChange): void {
    if (event.checked) {
      this.documentosValidacion[index].correcto = true;
      this.documentosValidacion[index].idMotivo = 0;
      this.listArchivosValidacion[index].correcto = true;
      this.listArchivosValidacion[index].motivo = 0;
    } else {
      this.listArchivosValidacion[index].correcto = false;
      this.documentosValidacion[index].correcto = false;
    }
  }

  onChangeMotivo(index: number, value: number, event: any): void {
    if (event.isUserInput) {
      this.listArchivosValidacion[index].motivo = value;
      this.documentosValidacion[index].idMotivo = value;
    }
  }

  mostrar(id: string) {

    let a = document.createElement('a');
    this.expedienteService.getByArchivo(id).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          let blobFile = this.utilsService.b64toBlob(
            response.data.base64,
            response.data.contentType,
            512
          );
          let urlBlobFile = window.URL.createObjectURL(blobFile);
          window.open(
            urlBlobFile,
            '_blank',
            'location=yes,height=650,width=600,scrollbars=yes,status=yes'
          );
        }
      },
    });
  }

  reproceso(workflow: IWorlFlow, idMotivo: number) {
    const ACTIVIDAD_REPROCESO: any = {
      5: 'Validación documental',
      6: 'Firma documental',
      7: 'Firma ejecutivo',
    };

    if (idMotivo != EMotivoRechazo.INFORMACION_INCORRECTA) {
      if (idMotivo == EMotivoRechazo.FIRMA_INCORRECTA_ASEGURADO) {
        workflow.notificacion = ENotificacion.SOLICITUD_FIRMA_ASEGURADO;
      }
      if (idMotivo == EMotivoRechazo.FIRMA_INCORRECTA_EJECUTIVO) {
        workflow.notificacion = ENotificacion.SOLICITUD_FIRMA_EJECUTIVO;
      }
    }

    this.workflowService.avanzar(workflow).subscribe((response) => {
      this.swalService
        .success({
          html: `Información almacenada correctamente, se reprocesa la actividad a <b>${ACTIVIDAD_REPROCESO[idMotivo]}</b>.`,
        })
        .then(() => {
          this.router.navigate(['/bandejas']);
        });
    });
  }

  cancelar() {
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }

  /**
   *
   * @returns
   * true   => Si existen documentos seleccionados, permite continuar la actividad
   * falase => No existen documentos seleccionados, no permite continuar la actividad
   */
  async validaSendFormatosFirmados() {
    const sendFormatosFirmadosResponde = await lastValueFrom(
      this.expedienteService.selectSendFormatosFirmados(
        this.folio.aseguradoraId,
        this.folio.titular,
        this.folio.folio
      )
    );
    return sendFormatosFirmadosResponde.data.length > 0 ? true : false;
  }

  indexandoAndPassValue() {
    const mapaOrden: {[key: string]: number} = {};
    this.documentosValidacion.forEach((item, index) => {
        mapaOrden[item.documento_id] = index;
    });

    this.listArchivosValidacion.forEach(archivo => {
        const index = mapaOrden[archivo.documento];
        if (index !== undefined) {
            archivo.correcto = this.documentosValidacion[index].correcto;
            archivo.motivo = this.documentosValidacion[index].idMotivo;
        }
    });

    this.listArchivosValidacion.sort((a, b) => mapaOrden[a.documento] - mapaOrden[b.documento]);
    
  }

}
