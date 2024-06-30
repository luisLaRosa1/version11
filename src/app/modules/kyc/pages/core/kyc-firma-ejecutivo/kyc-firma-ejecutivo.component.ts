import { Component, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';
import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';
import { EKycEstatusActividad } from 'src/app/modules/administracion/helpers/enums/kyc-estatus-actividad.enum';
import {
  IConfiguracionDocumental,
  IConfiguracionDocumentalCatalogs,
} from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import {
  IArchivo,
  IArchivoFolio,
  ICargaDocumentalMasivaCatalogs,
} from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import {
  IComentario,
  ISaveComentario,
} from 'src/app/modules/administracion/helpers/interfaces/core-comentario';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { AppConsts } from 'src/app/shared/AppConsts';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';
import { EFormAction } from 'src/app/shared/helpers/enums/form-action.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { KycEstatusBitacoraConsts } from '../../../helpers/consts/core/kyc-estatus-bitacora.consts';
import { KycComentarioService } from '../../../services/kyc-core-comentario.service';
import { KycFirmaClienteService } from '../../../services/kyc-core-firma-cliente.service';
import { KycFirmaEjecutivoService } from '../../../services/kyc-core-firma-ejecutivo.service';
import { KycWorkFlowService } from '../../../services/kyc-core.workflow.service';
import { KycExpedienteDigitalService } from '../../../services/kyc-expediente-digital.service';
import { KycWorkFlowActividadService } from '../../../services/kyc-workflow-actividad.service';
import { ENotificacion } from '../helpers/enums/notificacion.enum';
import { IBandejaPaginate } from '../helpers/interfaces/bandeja';
import {
  IKycValidacionDigital,
  IValidacionDigitalArchivos,
} from '../helpers/interfaces/kyc-core-validacion-documental';
import {
  IKycWorkflowDetalle,
  IKycWorklFlow,
} from '../helpers/interfaces/kyc-workflow';
import { IKycArchivosClasificacion, IKycFirmaEjecutivo } from '../helpers/interfaces/kyc-core-firma-ejecutivo';
import { EActividades } from 'src/app/shared/helpers/enums/actividades.enum';

@Component({
  selector: 'app-kyc-firma-ejecutivo',
  templateUrl: './kyc-firma-ejecutivo.component.html',
  styleUrls: ['./kyc-firma-ejecutivo.component.scss'],
})
export class KycFirmaEjecutivoComponent {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator =
    {} as MatPaginator;

  comentarioLength: number = AppConsts.SETTINGS.VALIDATIONS.LENGTH.Comentario;

  breadcrumbs: string[] = ['Conoce a tu cliente', 'Firma Ejecutivo'];
  action!: EFormAction;

  userSession!: IUserStorageUserDto;
  displayedColumns: string[] = [
    'documento',
    'url',
    'correcto',
    'idMotivo',
    'firmado',
  ];

  @ViewChild('formArchivo', { read: NgForm }) formComentario: any;
  dataArchivos: IArchivo[] = [];
  catalogos: ICargaDocumentalMasivaCatalogs = {};
  frmComentario = {} as FormGroup;
  comentario!: IComentario;
  IDCOMENTARIO: string | undefined = undefined;
  folio!: IBandejaPaginate;

  documentosValidacion: Array<any> = [];
  displayedColumnsFIC: string[] = ['documento', 'url'];
  documentosClasificacion: Array<any> = [];
  firmaEjecutivo: IKycValidacionDigital = {};
  firmaDocumental: any = {};
  currentId: string = '';
  readonlyModule: boolean = false;
  motivos: Array<ICatalogo> = [];

  currentActividad!: KYCEActividad;
  currenActividadEstatus!: EKycEstatusActividad;
  loading: boolean = true;
  documentosTitular: Array<any> = [];
  model = signal<IKycFirmaEjecutivo>({});
  archivosClasificacionSignal = signal<IKycArchivosClasificacion[]>([]);
  listValidacion: Array<IValidacionDigitalArchivos> = [];
  infoFolio: IArchivoFolio = {} as IArchivoFolio;
  comment: string = '';

  constructor(
    private notifierService: NotifierService,
    private userStorageService: UserStorageService,
    private formBuilder: FormBuilder,
    private workflowService: KycWorkFlowService,
    private workFlowActividadService: KycWorkFlowActividadService,
    private comentarioService: KycComentarioService,
    private expedienteService: KycExpedienteDigitalService,
    private configuracionDocumentalService: AdmConfiguracionDocumentalService,
    private firmaEjecutivoService: KycFirmaEjecutivoService,
    private swalService: SwalService,
    private router: Router,
    private utilsService: UtilsService,
    private ConfiguracionDocumentalService: AdmConfiguracionDocumentalService,
    private firmaDocumentalService: KycFirmaClienteService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.frmComentario = this.formBuilder.group({
      folio: ['', [Validators.required]],
      actividad: ['', [Validators.required]],
      titular: ['', [Validators.required]],
      comentarios: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.init();
  }

  init(): void {
    this.userSession = this.userStorageService.getCurrentUserInfo();
    const idFolio = this.route.snapshot.paramMap.get('id') || undefined;
    this.readonlyModule = history.state.readonlyModule || false;
    const actividadCodigo = KYCEActividad.FIRMA_EJECUTIVO;

    if (!idFolio) {
      this.return();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(idFolio, actividadCodigo)
      .subscribe({
        next: (response: IResponse<IKycWorkflowDetalle>) => {
          if (response.success) {
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;
            this.currentActividad = response.data.actividadCodigo;
            this.currenActividadEstatus = response.data.estatusActividad;
            this.model.mutate((value) => (value.folio = this.folio.folio));
            this.infoFolio = { id: this.folio.folio, folioMultisistema: this.folio.folioMultisistema, actividad: actividadCodigo };
            this.setComentario();
            this.getComentarios(true);
            this.getComentariosFirma()
            this.getCatalogs();
            this.getArchivosTitular();

            this.frmComentario.patchValue({
              folio: this.folio.folio,
              actividad: this.folio.actividadCodigo,
              titular: this.folio.titular,
              comentarios: '',
            });
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

  async getArchivosTitular(toRender = true) {
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
    }
    const firmaDocumentalService = await lastValueFrom(
      this.firmaDocumentalService.getByIdAndGetCatalogosToEdit(this.folio.folio)
    );

    if (toRender) {
      if (firmaDocumentalService.success) {
        this.firmaDocumental = firmaDocumentalService.data;
        this.documentosValidacion = [];
        if (firmaDocumentalService.data != null) {
          this.documentosTitular.forEach((element: any) => {
            let newElement = element;
            if (
              this.firmaDocumental!.archivoFic != undefined &&
              element.clave == EDocumento.FIC
            ) {
              newElement.id = this.firmaDocumental!.archivoFic;
              this.documentosValidacion.push(newElement);
            }
            if (
              this.firmaDocumental!.archivoAnexo != undefined &&
              element.clave == EDocumento.ANEXO
            ) {
              newElement.id = this.firmaDocumental!.archivoAnexo;
              this.documentosValidacion.push(newElement);
            }
          });
        }
        this.listValidacion = [];
        this.documentosValidacion.forEach((x) => {
          this.listValidacion.push({ documento: x.documento_id });
        });
      }
    }
    this.firmaEjecutivoService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {

            if (response.data !== null) {
              this.model.mutate((value) => (value._id = response.data._id));
              this.model.mutate((value) => (value.archivos = response.data.archivos));
              this.archivosClasificacionSignal.set(response.data.archivosClasificacion);
              this.model.mutate((value) => (value.archivosClasificacion = response.data.archivosClasificacion));

              this.documentosClasificacion = [];

              response.data.archivosClasificacion.forEach((x: any) => {

                let documento = this.documentosTitular.find(
                  (element: any) => element.documento_id == x.documento
                );

                if (documento.clave === EDocumento.FIC) {
                  documento.id = x.expediente
                }
                if (documento.clave === EDocumento.ANEXO) {
                  documento.id = x.expediente
                }
                this.documentosClasificacion.push(documento);
              });

              if (this.readonlyModule) {

                this.model().archivos?.forEach(model => {

                  const archivos = this.documentosTitular.find(
                    (j) => j.documento_id === model.documento
                  );

                  if (archivos.clave == EDocumento.FIC || archivos.clave == EDocumento.ANEXO) {
                    this.documentosValidacion = this.documentosValidacion.map(
                      (x) =>
                        x.documento_id === archivos.documento_id
                          ? { ...x, correcto: model.correcto }
                          : x
                    );
                  }
                })

              }

            } else {
              this.firmaEjecutivoService
                .create(this.model())
                .subscribe((response: any) => {
                  if (response.success) {
                    this.model.mutate(
                      (value) => (value._id = response.data._id)
                    );
                    this.getArchivosTitular();
                  }
                });
            }
          }
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
  }

  getCatalogs() {
    this.configuracionDocumentalService
      .getConfiguracionDocumentalByProyecto(
        this.folio.proyecto,
        this.folio.aseguradoraId,
        this.folio.titular
      )
      .subscribe({
        next: (response: IResponse<IConfiguracionDocumental>) => {
          if (response.success) {
            this.catalogos.documento = response.data.documento;
          } else console.error(response.message);
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });

    this.ConfiguracionDocumentalService.getCatalogs().subscribe({
      next: (response: IResponse<IConfiguracionDocumentalCatalogs>) => {
        if (response.success) {
          this.motivos = [
            ...new Set(
              response.data.motivo.filter(
                (element) => element.clave === 5 || element.clave === 6
              )
            ),
          ];
        } else console.error(response.message);
      },
      error: (err) => {
        this.return();
        this.notifierService.error(err?.error?.message);
      },
    });
  }

  changeCorrecto(index: number, event: any) {
    if (event.checked) {
      this.listValidacion[index].correcto = true;
      this.listValidacion[index].motivo = 0;
      this.documentosValidacion[index].idMotivo = 0;
    } else {
      this.listValidacion[index].correcto = false;
    }
  }

  onChangeMotivo(index: number, value: number) {
    this.listValidacion[index].motivo = value;
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


  async getComentariosFirma() {
    const response = await lastValueFrom(
      this.comentarioService.find(
        this.folio.folio,
        EActividades.VALIDACION_DE_FIRMAS.toString()
      )
    );
    if (response.success && response.data.length > 0) {
      this.comment = response.data[0].actividades.comentarios
    }
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

  onDragover(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
  onDragout(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  onChangeDocumento(index: number, value: string) {
    this.dataArchivos[index].documento = value;
  }

  getFilenameFromContentDisposition(res: any) {
    let filename = null;

    const disposition = res.headers.get('content-disposition');

    if (disposition?.includes('attachment')) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches?.[1]) {
        filename = matches[1].replace(/['"]/g, '');
        filename = decodeURIComponent(filename);
        filename = filename.replace(/^UTF-8/i, '').trim();
      }
    }

    return filename;
  }

  filevalidacionFormatos(id: string) {
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

  async download(element: any) {
    let a = document.createElement('a');
    this.expedienteService.getByArchivo(element.id).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          let blobFile = this.utilsService.b64toBlob(
            response.data.base64,
            response.data.contentType,
            512
          );
          let urlBlobFile = window.URL.createObjectURL(blobFile);
          a.href = urlBlobFile;
          a.target = '_blank';
          a.download = element.documento;
          a.click();
          URL.revokeObjectURL(urlBlobFile);
        }
      },
    });
  }

  showFile(url: string) {
    const urlFile = url.split('/');
    const nombreFile = urlFile[urlFile.length - 1];
    let a = document.createElement('a');
    this.expedienteService
      .getFileBase64ByFileName(nombreFile, this.folio.titular)
      .subscribe({
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

  return(): void {
    this.frmComentario.patchValue({});
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }

  async saveData(docsForm: NgForm) {

    if (!docsForm.valid) {
      this.swalService.info({
        html: 'Debe completar los campos requeridos.',
      });
      return;
    }

    this.model.mutate((value) => (value.archivos = this.listValidacion));

    if (this.model()._id != '') {
      this.firmaEjecutivoService
        .update(this.model()._id || '', this.model())
        .subscribe((response) => { });
    }

    const dataForComentary: ISaveComentario = {
      folio: this.folio.folio,
      comentarios: docsForm.control.get('comentarios')?.value,
      actividad: this.folio.actividadCodigo,
    };

    await this.getComentarios(false);

    if (this.IDCOMENTARIO == undefined) {
      this.comentarioService.create(dataForComentary).subscribe();
    } else {
      this.comentario.actividades.comentarios = dataForComentary.comentarios;
      this.comentarioService
        .update(`${this.folio.folio}`, this.comentario)
        .subscribe((response) => { });
    }

    const documentosIncorrectos = this.listValidacion.filter(
      (element) => element.correcto == false || element.correcto == undefined
    );

    if (documentosIncorrectos.length > 0) {
      const faltanMotivos = documentosIncorrectos.filter(
        (element) => element.motivo === 0 || !element.motivo
      );

      if (faltanMotivos.length > 0) {
        this.swalService.info({
          text: 'Motivos de rechazo son requeridos para avanzar la actividad',
        });
        return;
      }

      const workflow: IKycWorklFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal:
          documentosIncorrectos[0].motivo === 5
            ? KYCEActividad.VALIDACION_DIGITAL
            : KYCEActividad.FIRMA_CLIENTE,
        actividad:
          documentosIncorrectos[0].motivo === 5
            ? KycEstatusBitacoraConsts.CORRECION_DE_FORMATOS
            : KycEstatusBitacoraConsts.EN_ESPERA_DE_FIRMA_ASEGURADO,
        notificacion:
          documentosIncorrectos[0].motivo === 5
            ? 0
            : ENotificacion.SOLICITUD_FIRMA_ASEGURADO,
        reproceso: true,
        comentarios: docsForm.control.get('comentarios')?.value,
      };

      const actividad =
        documentosIncorrectos[0].motivo === 5
          ? 'Validación documental'
          : 'Firma documental';

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: `Información almacenada correctamente, se reprocesa la actividad a <b>${actividad} </b>`,
          })
          .then(() => {
            this.router.navigate(['/bandejas']);
          });
      });
    } else {
      if (this.documentosClasificacion.filter(x => x.clave === EDocumento.FIC).length === 0) {
        this.swalService.info({
          text: 'Documento Formato de identificación del cliente (FIC) es requerido para avanzar la actividad',
        });
        return;
      }


      this.swalService
        .question({
          html: '¿Confirma que ha subido los documentos cotejados?',
        })
        .then((result) => {
          if (result.isConfirmed) {

            const workflow: IKycWorklFlow = {
              folio: this.folio.folio,
              actividadInicial: this.folio.actividadCodigo,
              actividadFinal: KYCEActividad.VALIDACION_FIRMAS,
              actividad: KycEstatusBitacoraConsts.EN_VALIDACION_DE_FIRMAS,
              comentarios: docsForm.control.get('comentarios')?.value,
            };

            this.workflowService.avanzar(workflow).subscribe((response) => {
              this.swalService
                .success({
                  html: 'Información almacenada correctamente, se avanzó la actividad a <b>Validación firmas</b>',
                })
                .then(() => {
                  this.router.navigate(['/bandejas']);
                });
            });
          }
        });
    }
  }

  updateEventUploadFile(file: any) { }

  updateEventResponseFile(file: any) {

    const data: Array<IKycArchivosClasificacion> = [];
    const documento = this.documentosTitular.find(x => x.documento_id == file.documento);
    const filter = this.archivosClasificacionSignal().find(x => x.documento == documento.documento_id);

    if (filter) {
      this.archivosClasificacionSignal().forEach((item: any) => {
        if (item.documento == filter.documento) {
          item.expediente = file._id;
        }
      })
    } else {
      data.push({
        documento: file.documento,
        expediente: file._id
      })

      this.archivosClasificacionSignal.update((values: any) => {
        return [...values, data];
      });
    }

    this.model.mutate(
      (value) => (value.archivosClasificacion = [...this.archivosClasificacionSignal()])
    );

    this.firmaEjecutivoService
      .update(this.model()._id || '', this.model())
      .subscribe((response) => {
        this.getArchivosTitular(false);
      });
  }

  generarMensajeHtml(documentos: Array<string>): string {
    let mensaje = '';
    mensaje += "<div style='text-align: left'> </br>";
    mensaje += '<ul>';
    documentos.forEach((element: any) => {
      mensaje += '<li>';
      mensaje += element;
      mensaje += '</li>';
    });
    mensaje += '</ul>';
    mensaje += '</div> </br>';
    return mensaje;
  }

  async downloadZip() {
    this.swalService.descargar({});
    let a = document.createElement('a');
    this.expedienteService.getFileZipBase64(
      this.folio.folio,
      this.folio.titular
    ).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          if (response.data != null && response.data?.base64 != null) {
            let blobFile = this.utilsService.b64toBlob(
              response.data.base64,
              response.data.contentType,
              512
            );
            let urlBlobFile = window.URL.createObjectURL(blobFile);
            a.href = urlBlobFile;
            a.target = '_blank';
            a.download = "DocumentosAutorizados.zip";
            a.click();
            URL.revokeObjectURL(urlBlobFile);
            setTimeout(() => {
              this.swalService.close({});
            }, 500);
          }
        } else {
          this.swalService.close({});
        }
      }, error: (err) => {
        this.swalService.close({});
        this.notifierService.error(err?.error?.message);
      }
    });
  }

  getDocumentosCorrectos() {
    return this.listValidacion.filter(x => x.correcto).length == this.listValidacion.length || this.readonlyModule;
  }
}
