import { Component, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';
import { EKycEstatusActividad } from 'src/app/modules/administracion/helpers/enums/kyc-estatus-actividad.enum';
import {
  IConfiguracionDocumental,
  IConfiguracionDocumentalCatalogs,
  IConfiguracionDocumentalDocumentos,
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
import { KycValidacionService } from '../../../services/kyc-core-validacion-documental.service';
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
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-kyc-firma-cliente',
  templateUrl: './kyc-firma-cliente.component.html',
  styleUrls: ['./kyc-firma-cliente.component.scss'],
})
export class KycFirmaClienteComponent {
  comentarioLength: number = AppConsts.SETTINGS.VALIDATIONS.LENGTH.Comentario;

  breadcrumbs: string[] = ['Conoce a tu cliente', 'Firma documental'];
  action!: EFormAction;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator =
    {} as MatPaginator;

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
  documentosFIC: Array<any> = [];
  validacion: IKycValidacionDigital = {};
  readonlyModule: boolean = false;
  motivos: Array<ICatalogo> = [];

  currentActividad!: KYCEActividad;
  currenActividadEstatus!: EKycEstatusActividad;
  loading: boolean = true;
  documentosTitular: Array<any> = [];

  model = signal<IKycValidacionDigital>({});
  listValidacion: Array<IValidacionDigitalArchivos> = [];
  infoFolio: IArchivoFolio = {} as IArchivoFolio;

  constructor(
    private notifierService: NotifierService,
    private userStorageService: UserStorageService,
    private formBuilder: FormBuilder,
    private workflowService: KycWorkFlowService,
    private workFlowActividadService: KycWorkFlowActividadService,
    private comentarioService: KycComentarioService,
    private expedienteService: KycExpedienteDigitalService,
    private configuracionDocumentalService: AdmConfiguracionDocumentalService,
    private firmaDocumentalService: KycFirmaClienteService,
    private swalService: SwalService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private utilsService: UtilsService,
    private ConfiguracionDocumentalService: AdmConfiguracionDocumentalService,
    private validacionService: KycValidacionService
  ) { }

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
    const idFolio = this.route.snapshot.paramMap.get('id') || undefined;
    this.readonlyModule = history.state.readonlyModule || false;
    const actividadCodigo = KYCEActividad.FIRMA_CLIENTE;

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
    }

    const validacionService = await lastValueFrom(
      this.validacionService.getByIdAndGetCatalogosToEdit(this.folio.folio)
    );

    if (validacionService.success) {
      this.validacion = validacionService.data;

      this.documentosValidacion = [];
      if (validacionService.data != null) {
        this.documentosTitular.forEach((element: any) => {
          let newElement = element;
          if (
            this.validacion!.archivoFic != undefined &&
            element.clave == EDocumento.FIC
          ) {
            newElement.id = this.validacion!.archivoFic;
            newElement.correcto = false;
            this.documentosValidacion.push(newElement);
          }
          if (
            this.validacion!.archivoAnexo != undefined &&
            element.clave == EDocumento.ANEXO
          ) {
            newElement.id = this.validacion!.archivoAnexo;
            newElement.correcto = false;
            this.documentosValidacion.push(newElement);
          }
        });

        this.listValidacion = [];
        this.documentosValidacion.forEach((x) => {
          this.listValidacion.push({ documento: x.documento_id });
        });
      }
    }

    this.firmaDocumentalService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {
            if (response.data !== null) {
              this.model.mutate((value) => (value._id = response.data._id));
              this.model.mutate(
                (value) => (value.archivoAnexo = response.data.archivoAnexo)
              );
              this.model.mutate(
                (value) => (value.archivoFic = response.data.archivoFic)
              );
              this.model.mutate(
                (value) => (value.archivos = response.data.archivos)
              );

              this.documentosValidacion.forEach((x) => {
                const foundIndex = this.documentosValidacion.findIndex(
                  (i) => i.documento === x.documento_id
                );
                if (foundIndex >= 0) {
                  this.documentosValidacion[foundIndex].vigencia = x.vigencia;
                  this.documentosValidacion[foundIndex].correcto = x.correcto;
                }
              });

              this.documentosFIC = [];
              if (this.model()!.archivoFic) {
                let documento = this.documentosTitular.find(
                  (element: any) => element.clave == EDocumento.FIC
                );
                documento.id = this.model()!.archivoFic;
                this.documentosFIC.push(documento);

                if (this.readonlyModule) {
                  const archivos = this.model().archivos?.filter(
                    (x) => x.clave === documento.clave
                  );
                  this.documentosValidacion = this.documentosValidacion.map(
                    (x) =>
                      x.clave === archivos![0].clave
                        ? { ...x, correcto: archivos![0].correcto }
                        : x
                  );
                }
              }
              if (this.model()!.archivoAnexo) {
                let documento = this.documentosTitular.find(
                  (element: any) => element.clave == EDocumento.ANEXO
                );
                documento.id = this.model()!.archivoAnexo;
                this.documentosFIC.push(documento);

                if (this.readonlyModule) {
                  const archivos = this.model().archivos?.filter(
                    (x) => x.clave === documento.clave
                  );
                  this.documentosValidacion = this.documentosValidacion.map(
                    (x) =>
                      x.clave === archivos![0].clave
                        ? { ...x, correcto: archivos![0].correcto }
                        : x
                  );
                }
              }
            } else {
              this.firmaDocumentalService
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
            this.catalogos.documento = [
              ...new Set(
                response.data.documento.filter(
                  (element: IConfiguracionDocumentalDocumentos) =>
                    element.clave == EDocumento.FIC ||
                    element.clave == EDocumento.ANEXO
                )
              ),
            ];
          } else console.error(response.message);
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });

    this.ConfiguracionDocumentalService.getCatalogs().subscribe({
      next: (response: IResponse<IConfiguracionDocumentalCatalogs>) => {
        if (response.success) {
          this.motivos = [
            ...new Set(
              response.data.motivo.filter((element) => element.clave === 5)
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

  changeCorrecto(index: number, event: MatSlideToggleChange) {
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

  setComentario() {
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
      this.firmaDocumentalService
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
      (element) =>
        element.correcto == false ||
        element.correcto == undefined ||
        element.motivo != 0
    );

    if (documentosIncorrectos.length > 0) {
      const faltanMotivos = documentosIncorrectos.filter(
        (element) => element.motivo === 0 || !element.motivo
      );
      if (faltanMotivos.length > 0) {
        this.swalService.info({
          text: 'Motivos de rechazo son requerido para avanzar la actividad',
        });
        return;
      }

      const workflow: IKycWorklFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal: KYCEActividad.VALIDACION_DIGITAL,
        actividad: KycEstatusBitacoraConsts.CORRECION_DE_FORMATOS,
        reproceso: true,
        comentarios: docsForm.control.get('comentarios')?.value,
      };

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: 'Información almacenada correctamente, se reprocesa la actividad a <b>Validación documental </b>',
          })
          .then(() => {
            this.router.navigate(['/bandejas']);
          });
      });
    } else {
      if (
        this.documentosFIC.filter((x) => x.clave === EDocumento.FIC).length ===
        0
      ) {
        this.swalService.info({
          text: 'Documento Formato de identificación del cliente (FIC) es requerido para avanzar la actividad',
        });
        return;
      }

      const workflow: IKycWorklFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal: KYCEActividad.FIRMA_EJECUTIVO,
        actividad: KycEstatusBitacoraConsts.EN_ESPERA_DE_FIRMA_EJECUTIVO,
        comentarios: docsForm.control.get('comentarios')?.value,
        notificacion: ENotificacion.SOLICITUD_FIRMA_EJECUTIVO,
      };

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: 'Información almacenada correctamente, se avanzó la actividad a <b>Firma ejecutivo</b>',
          })
          .then(() => {
            this.router.navigate(['/bandejas']);
          });
      });
    }
  }

  updateEventUploadFile(file: any) { }

  updateEventResponseFile(file: any) {
    if (file.clave == EDocumento.FIC) {
      this.model.mutate((value) => (value.archivoFic = file._id));
    }
    if (file.clave == EDocumento.ANEXO) {
      this.model.mutate((value) => (value.archivoAnexo = file._id));
    }

    this.firmaDocumentalService
      .update(this.model()._id || '', this.model())
      .subscribe((response) => {
        this.getArchivosTitular();
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
}
