import { Component, ViewChild, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';
import {
  IConfiguracionDocumental,
  IConfiguracionDocumentalDocumentos,
} from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { IFormatoKycFileBase64 } from 'src/app/modules/administracion/helpers/interfaces/adm-formato';
import {
  IArchivo,
  IArchivoFolio,
  ICargaDocumentalMasivaCatalogs,
} from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import {
  IComentario,
  ISaveComentario,
} from 'src/app/modules/administracion/helpers/interfaces/core-comentario';
import { CountryType } from 'src/app/modules/administracion/helpers/interfaces/core-validacion-documental';
import { IWorlFlow } from 'src/app/modules/administracion/helpers/interfaces/core-workflow';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { AdmFormatoKycService } from 'src/app/modules/administracion/services/adm-formato.service';
import { WorkFlowService } from 'src/app/modules/administracion/services/core.workflow.service';
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
import { KycValidacionService } from '../../../services/kyc-core-validacion-documental.service';
import { KycEncabezadoService } from '../../../services/kyc-encabezado.service';
import { KycExpedienteDigitalService } from '../../../services/kyc-expediente-digital.service';
import { KycWorkFlowActividadService } from '../../../services/kyc-workflow-actividad.service';
import { ENotificacion } from '../helpers/enums/notificacion.enum';
import { IBandejaPaginate } from '../helpers/interfaces/bandeja';
import {
  IKycApoderado,
  IKycValidacionDigital,
  IValidacionDigitalArchivos,
} from '../helpers/interfaces/kyc-core-validacion-documental';
import { IKycWorkflowDetalle } from '../helpers/interfaces/kyc-workflow';
import { KycListaNegraService } from '../../../services/kyc-lista-negra.service';

@Component({
  selector: 'app-kyc-validacion-digital',
  templateUrl: './kyc-validacion-digital.component.html',
  styleUrls: ['./kyc-validacion-digital.component.scss'],
})
export class KycValidacionDigitalComponent {
  comentarioLength: number = AppConsts.SETTINGS.VALIDATIONS.LENGTH.Comentario;

  breadcrumbs: string[] = ['Conoce a tu cliente', 'Validacion digital'];
  action!: EFormAction;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator =
    {} as MatPaginator;

  userSession!: IUserStorageUserDto;
  displayedColumns: string[] = [
    'documento',
    'url',
    'correcto',
    'idMotivo',
    'fechaVigencia',
  ];

  @ViewChild('formArchivo', { read: NgForm }) formComentario: any;
  dataArchivos: IArchivo[] = [];
  catalogos: ICargaDocumentalMasivaCatalogs = {};
  documentos: any = [];
  frmComentario = {} as FormGroup;
  frmApoderado = {} as FormGroup;
  IDCOMENTARIO: string | undefined = undefined;
  folio!: IBandejaPaginate;
  documentosValidacion: Array<any> = [];
  displayedColumnsFIC: string[] = ['documento', 'url'];
  documentosTemplateFIC: Array<any> = [];
  documentosFIC: Array<any> = [];
  validacion: IKycValidacionDigital = {};
  readonlyModule: boolean = false;
  loading: boolean = true;
  comentario!: IComentario;
  model = signal<IKycValidacionDigital>({});
  modelApoderado = signal<IKycApoderado>({});
  documentosTitular: Array<any> = [];
  paises: CountryType[] = [];
  listArchivosValidacion: Array<IValidacionDigitalArchivos> = [];
  infoFolio: IArchivoFolio = {} as IArchivoFolio;
  folioAutorizado = false;
  folioAutorizadoEstatus: [] = [];

  constructor(
    private notifierService: NotifierService,
    private userStorageService: UserStorageService,
    private workFlowActividadService: KycWorkFlowActividadService,
    private formBuilder: FormBuilder,
    private workflowService: WorkFlowService,
    private comentarioService: KycComentarioService,
    private expedienteService: KycExpedienteDigitalService,
    private configuracionDocumentalService: AdmConfiguracionDocumentalService,
    private validacionService: KycValidacionService,
    private formatoKycService: AdmFormatoKycService,
    private encabezadoService: KycEncabezadoService,
    private swalService: SwalService,
    private router: Router,
    private utilsService: UtilsService,
    private readonly route: ActivatedRoute,
    private kycListaNegraService: KycListaNegraService

  ) { }

  ngOnInit(): void {
    this.frmComentario = this.formBuilder.group({
      folio: ['', [Validators.required]],
      actividad: ['', [Validators.required]],
      titular: ['', [Validators.required]],
      comentarios: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.frmApoderado = new FormGroup({
      pais: new FormControl('', [Validators.required]),
      apoderado: new FormControl('', [Validators.required]),
      tipoPersona: new FormControl(''),
    });

    this.init();
  }

  init(): void {
    this.userSession = this.userStorageService.getCurrentUserInfo();
    const idFolio = this.route.snapshot.paramMap.get('id') || undefined;
    this.readonlyModule = history.state.readonlyModule || false;
    const actividadCodigo = KYCEActividad.VALIDACION_DIGITAL;

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

            this.frmComentario.patchValue({
              folio: this.folio.folio,
              actividad: this.folio.actividadCodigo,
              titular: this.folio.titular,
              comentarios: '',
            });
            this.model.mutate((value) => (value.folio = this.folio.folio));
            this.infoFolio = { id: this.folio.folio, folioMultisistema: this.folio.folioMultisistema, actividad: actividadCodigo };
            this.setComentario();
            this.getComentarios(true);
            this.getCatalogs();
            this.getArchivosTitular();
            this.getInfoFolio();
            this.validFolioAutorizado();

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

    this.insertSelectCountry();
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

      if (toRender) {
        this.documentosValidacion = [
          ...new Set(
            this.documentosTitular.filter((element) => element.categoria == 1)
          ),
        ];
      }

      if (this.listArchivosValidacion.length <= 0) {
        this.documentosValidacion.forEach((x) => {
          this.listArchivosValidacion.push({ documento: x.documento_id });
        });
      }

      this.formatoKycService
        .getByProyectoAseguradora(this.folio.aseguradoraId)
        .subscribe({
          next: (response: IResponse<any>) => {
            if (response.success) {
              response.data.forEach((element: any) => {
                this.documentosTemplateFIC = response.data;
              });
            }
          },
        });

      this.validacionService
        .getByIdAndGetCatalogosToEdit(this.folio.folio)
        .subscribe({
          next: (response: IResponse<any>) => {
            if (response.success) {
              this.validacion = response.data;
              if (response.data != null) {
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

                if (
                  response.data.apoderado &&
                  response.data.pais &&
                  response.data.tipoPersona
                ) {
                  this.apoderado.setValue(response.data.apoderado);
                  this.selectPais.setValue(response.data.pais);
                  this.tipoPersona.setValue(response.data.tipoPersona);
                }

                if (toRender) {
                  
                  this.modelApoderado.mutate((value) => (value.apoderado = response.data.apoderado));
                  this.modelApoderado.mutate((value) => (value.pais = response.data.pais));
                  this.modelApoderado.mutate((value) => (value.paisDescripcion = response.data.paisDescripcion));

                  this.documentosValidacion.map((x) => {
                    let element: any = x;
                    element.vigencia = this.documentos?.find(
                      (element: any) => element.clave == x.clave
                    )?.vigencia;

                    this.validacion.archivos?.filter((i) => {
                      if (x.documento_id === i.documento) {
                        (x.correcto = i.correcto),
                          (x.fechaVigencia = i.fechaVigencia),
                          (x.idMotivo = i.motivo),
                          (x.id = i.expediente);
                      }
                    });
                  });
                }

                this.documentosValidacion.forEach((x) => {
                  const foundIndex = this.listArchivosValidacion.findIndex(
                    (i) => i.documento === x.documento_id
                  );
                  if (foundIndex >= 0) {
                    this.listArchivosValidacion[foundIndex].vigencia =
                      x.vigencia;
                    this.listArchivosValidacion[foundIndex].correcto =
                      x.correcto;
                    this.listArchivosValidacion[foundIndex].fechaVigencia =
                      x.fechaVigencia;
                  }
                });

                this.documentosFIC = [];
                this.documentosTitular.forEach((element: any) => {
                  let newElement = element;
                  if (
                    this.validacion!.archivoFic != undefined &&
                    element.clave == EDocumento.FIC
                  ) {
                    newElement.id = this.validacion!.archivoFic;
                    this.documentosFIC.push(newElement);
                  }
                  if (
                    this.validacion!.archivoAnexo != undefined &&
                    element.clave == EDocumento.ANEXO
                  ) {
                    newElement.id = this.validacion!.archivoAnexo;
                    this.documentosFIC.push(newElement);
                  }
                });
              } else {
                this.validacionService
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
  }

  async getCatalogs() {
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
            this.documentos = [...new Set(response.data.documento)];
          } else console.error(response.message);
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
  }

  async getInfoFolio() {
    const response = await lastValueFrom(
      this.encabezadoService.getInfoGeneralByFolio(this.folio.folio)
    );
    if (response.success) {
      this.tipoPersona.setValue(response.data.tipoPersona);
    }
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

  onDrop(event: DragEvent) { }

  changeCorrecto(index: number, event: any): void {
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

  onChangeTitular(index: number, value: string): void {
    this.dataArchivos[index].titular = value;
    if (index == 0) {
      this.dataArchivos.forEach((item) => {
        item.titular = value;
      });
    }
  }

  onChangeDocumento(index: number, value: string): void {
    this.dataArchivos[index].documento = value;
  }

  onChangeFechaVigencia(index: number, value: Date): void {
    this.dataArchivos[index].fechaVigencia = value;
  }

  onChangeMotivo(index: number, value: number): void {
    this.listArchivosValidacion[index].motivo = value;
  }

  viewDownload(data: any): void {
    this.formatoKycService.getFileBase64ByFileName(data._id).subscribe({
      next: (response: IResponse<IFormatoKycFileBase64>) => {
        if (response.success) {
          let blobFile = this.utilsService.b64toBlob(
            response.data.base64,
            response.data.contentType,
            512
          );
          let urlBlobFile = window.URL.createObjectURL(blobFile);
          let a = document.createElement('a');
          a.href = urlBlobFile;
          a.target = '_blank';
          a.download = data.nombre;
          a.click();
          URL.revokeObjectURL(urlBlobFile);
        }
      },
      error: (err) => this.notifierService.error(err?.error?.message),
    });
  }

  async showFile(element: any) {
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

  return(): void {
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }

  async saveData(docsForm: NgForm) {
    if (!docsForm.valid) {
      this.swalService.info({
        html: 'Debe completar los campos requeridos.',
      });
      return;
    }

    this.listArchivosValidacion.map((x) => {
      const filter = this.documentosValidacion.filter(
        (j) => x.documento === j.documento_id
      );
      x.fechaVigencia = filter[0].fechaVigencia;
      x.expediente = filter[0].id;
    });

    this.model.mutate(
      (value) => (value.archivos = this.listArchivosValidacion)
    );
    this.model.mutate((value) => (value.apoderado = this.apoderado.value));
    this.model.mutate((value) => (value.pais = this.selectPais.value));
    this.model.mutate((value) => (value.tipoPersona = this.tipoPersona.value));

    if (this.model()._id != '') {
      this.validacionService
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

    const documentosCorrectos = [
      ...new Set(
        this.documentosValidacion.filter(
          (element) => element.categoria != 3 && element.correcto
        )
      ),
    ];

    if (documentosCorrectos.length === this.documentosValidacion.length) {
      this.frmApoderado.markAllAsTouched();

      await this.validFolioAutorizado();

      if (!this.folioAutorizado) {
        this.swalService.info({
          html: 'Para poder avanzar el folio debe estar previamente autorizado en la bandeja de lista negra.',
        });
        return;
      }

      if (!this.frmApoderado.valid) {
        this.swalService.info({
          html: 'Debe completar los campos de apoderado y países.',
        });
        return;
      }

      if (
        this.documentosFIC.filter((x) => x.clave === EDocumento.FIC).length ===
        0
      ) {
        this.swalService.info({
          text: 'Documento Formato de identificación del cliente (FIC) es requerido para avanzar la actividad',
        });
        return;
      }

      const workflow: IWorlFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal: KYCEActividad.FIRMA_CLIENTE,
        actividad: KycEstatusBitacoraConsts.EN_PROCESO_DE_GESTION,
        notificacion: ENotificacion.FIRMA_DOCUMENTOS,
        comentarios: docsForm.control.get('comentarios')?.value,
      };

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: 'Información almacenada correctamente, se avanzó la actividad a <b>Firma documental</b>',
          })
          .then(() => {
            this.router.navigate(['/bandejas']);
          });
      });
    } else {

      const workflow: IWorlFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal: KYCEActividad.CARGA_DOCUMENTAL,
        actividad: KycEstatusBitacoraConsts.FALTA_DE_INFORMACION,
        reproceso: true,
        notificacion: ENotificacion.REVISION_DOCUMENTAL,
        comentarios: docsForm.control.get('comentarios')?.value,
      };

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: 'Información almacenada correctamente, se reprocesa la actividad a <b>Carga documental</b>',
          })
          .then(() => {
            this.router.navigate(['/bandejas']);
          });
      });
    }
  }

  sendListaNegra() {

    if (this.apoderado.value.trim() == "") {
      this.frmApoderado.controls['apoderado'].setErrors({ incorrect: true });
    }

    this.frmApoderado.markAllAsTouched();

    if (!this.frmApoderado.valid) {
      this.swalService.info({
        html: 'Debe completar los campos de apoderado y país.',
      });
      return;
    }

    if (this.modelApoderado().apoderado?.trim() === this.apoderado.value.trim() && this.modelApoderado().pais === this.selectPais.value) {
      this.swalService.info({
        html: `El folio <b>${this.folio.folioCodigo}</b> con el apoderado <b>${this.modelApoderado().apoderado}</b> y el país <b>${this.modelApoderado().paisDescripcion}</b> ya ha sido autorizado`,
      });
      return;
    }

    this.listArchivosValidacion.map((x) => {
      const filter = this.documentosValidacion.filter(
        (j) => x.documento === j.documento_id
      );
      x.fechaVigencia = filter[0].fechaVigencia;
      x.expediente = filter[0].id;
    });

    this.model.mutate(
      (value) => (value.archivos = this.listArchivosValidacion)
    );
    this.model.mutate((value) => (value.apoderado = this.apoderado.value));
    this.model.mutate((value) => (value.pais = this.selectPais.value));
    this.model.mutate((value) => (value.tipoPersona = this.tipoPersona.value));
    this.model.mutate((value) => (value.isListaNegra = true));

    if (this.model()._id != '') {
      this.validacionService
        .update(this.model()._id || '', this.model())
        .subscribe((response) => {
          response.success ? this.swalService.success({ html: 'Información ha sido enviada para su autorización.' }).then(() => {
            this.router.navigate(['/bandejas']);
          }) : this.swalService.error({ html: 'Ocurrió un error al guardar la información.' });
        });
    }
  }

  updateEventResponseFile(file: any) {
    this.model.mutate((value) => (value.apoderado = this.apoderado.value));
    this.model.mutate((value) => (value.pais = this.selectPais.value));
    this.model.mutate((value) => (value.tipoPersona = this.tipoPersona.value));

    if (file.clave == EDocumento.FIC) {
      this.model.mutate((value) => (value.archivoFic = file._id));
    }
    if (file.clave == EDocumento.ANEXO) {
      this.model.mutate((value) => (value.archivoAnexo = file._id));
    }

    this.validacionService
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

  insertSelectCountry() {
    this.validacionService.listAllCountryApoderado().subscribe({
      next: (response: IResponse<CountryType[]>) => {
        if (response.success) {
          this.paises = response.data;
        } else console.error(response.message);
      },
      error: (err: any) => this.notifierService.warning(err?.error?.message),
    });
  }

  async validFolioAutorizado() {
    try {
      const response = await lastValueFrom(
        this.kycListaNegraService.findFolioAutorizado(this.folio.folio)
      );
      this.folioAutorizadoEstatus = response.data;
      this.folioAutorizado = response.data[0].autorizado;
    } catch (error) {
      this.folioAutorizado = false;
    }
  }

  get selectPais(): FormControl {
    return this.frmApoderado.get('pais') as FormControl;
  }

  get apoderado(): FormControl {
    return this.frmApoderado.get('apoderado') as FormControl;
  }

  get tipoPersona(): FormControl {
    return this.frmApoderado.get('tipoPersona') as FormControl;
  }
}
