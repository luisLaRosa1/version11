import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';
import { IConfiguracionDocumental } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import {
  IArchivo,
  ICargaDocumentalMasivaCatalogs,
} from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import {
  IComentario,
  ISaveComentario,
} from 'src/app/modules/administracion/helpers/interfaces/core-comentario';
import { IWorlFlow } from 'src/app/modules/administracion/helpers/interfaces/core-workflow';
import { AdmDocumentoService } from 'src/app/modules/administracion/services/adm-documento.service';
import { WorkFlowService } from 'src/app/modules/administracion/services/core.workflow.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { KycEstatusBitacoraConsts } from '../../../helpers/consts/core/kyc-estatus-bitacora.consts';
import { ConfirmacionEntregaService } from '../../../services/kyc-confirmacion-entrega.service';
import { KycComentarioService } from '../../../services/kyc-core-comentario.service';
import { KycWorkFlowActividadService } from '../../../services/kyc-workflow-actividad.service';
import { ENotificacion } from '../helpers/enums/notificacion.enum';
import { IBandejaPaginate } from '../helpers/interfaces/bandeja';
import { IKycConfirmacionEntrega } from '../helpers/interfaces/fnz-confirmacion-entrega';
import { IKycWorkflowDetalle } from '../helpers/interfaces/kyc-workflow';

@Component({
  selector: 'app-kyc-confirmacion-entrega',
  templateUrl: './kyc-confirmacion-entrega.component.html',
  styleUrls: ['./kyc-confirmacion-entrega.component.scss'],
})
export class KycConfirmacionEntregaComponent {
  comentarioLength: number = AppConsts.SETTINGS.VALIDATIONS.LENGTH.Comentario;
  allowedExtensions: string =
    AppConsts.SETTINGS.FILES.EXTENSIONS.ConfirmacionEntrega.replaceAll(
      ';',
      ','
    );

  breadcrumbs: string[] = ['Kyc', 'Confirmacion de entrega'];
  frmConfirmacionEntrega!: FormGroup;
  idFolio: number = 0;
  placeholderFile = 'Seleccione un archivo';
  fileName: string = '';
  catalogos: ICargaDocumentalMasivaCatalogs = {};
  frmComentario = {} as FormGroup;
  IDCOMENTARIO: string | undefined = undefined;
  folio!: IBandejaPaginate;
  configuracion!: IConfiguracionDocumental;
  userSession!: IUserStorageUserDto;
  archivo!: any;
  isUploading: Boolean = false;
  uploadProgress: number = 0;
  comentario!: IComentario;
  currentConfirmacionEntregaId: string = '';
  entregado: boolean = false;
  comentarioTemp: string = '';
  confirmacionEntrega: IKycConfirmacionEntrega = {
    entregado: false,
    archivos: ([] = [
      {
        expediente: undefined,
        usuarioAlta: undefined,
        fechaHoraAlta: new Date(),
      },
    ]),
  };
  readonlyModule: boolean = false;
  loading: boolean = true;
  documentoId = '';

  constructor(
    private formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private notifierService: NotifierService,
    private swalService: SwalService,
    private router: Router,
    private userStorageService: UserStorageService,
    private http: HttpClient,
    private workflowService: WorkFlowService,
    private comentarioService: KycComentarioService,
    private workFlowActividadService: KycWorkFlowActividadService,
    private confirmacionEntregaService: ConfirmacionEntregaService,
    private admDocumentoService: AdmDocumentoService
  ) {}

  ngOnInit(): void {
    this.userSession = this.userStorageService.getCurrentUserInfo();
    this.readonlyModule = history.state.readonlyModule || false;
    const folio = this.route.snapshot.paramMap.get('id') || undefined;

    if (!folio) {
      this.return();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(
        folio,
        KYCEActividad.CONFIRMACION_ENTREGA
      )
      .subscribe({
        next: (response: IResponse<IKycWorkflowDetalle>) => {
          if (response.success) {
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;
            this.loadForm(this.entregado);
            this.getComentarios();
            this.getConfirmacionEntrega();
            this.getDocumento();
            this.loading = false;
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

  async getConfirmacionEntrega(): Promise<void> {
    this.confirmacionEntregaService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success && response.data !== null) {
            this.currentConfirmacionEntregaId = response.data._id;
            this.confirmacionEntrega = response.data;
            this.loadForm(this.confirmacionEntrega.entregado);
          }
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
  }

  async getComentarios(): Promise<void> {
    const response = await lastValueFrom(
      this.comentarioService.find(
        this.folio.folio,
        this.folio.actividadCodigo.toString()
      )
    );

    if (response.success && response.data.length > 0) {
      this.comentarioTemp = response.data[0].actividades.comentarios;
      this.frmConfirmacionEntrega.patchValue({
        comentarios: response.data[0].actividades.comentarios,
      });
      this.IDCOMENTARIO = response.data[0]._id;
      this.loadForm(this.entregado);
    }
  }

  loadForm(entregado: boolean): void {
    this.frmConfirmacionEntrega = this.formBuilder.group({
      id: new FormControl(0, [Validators.required]),
      idFolio: new FormControl(this.idFolio, [Validators.required]),
      entregado: new FormControl(entregado, [Validators.required]),
      comentarios: new FormControl(this.comentarioTemp, [
        Validators.required,
        Validators.pattern(AppConsts.SETTINGS.PATTERNS.Alphanumeric),
      ]),
    });

    if (this.readonlyModule) this.frmConfirmacionEntrega.disable();
  }

  confirmacionEntregaSubmit() {
    const validar = this.validacionesFormulario(this.frmConfirmacionEntrega);

    if (!validar) return;

    this.swalService
      .question({
        text: 'Se finalizará el flujo, ¿Está de acuerdo?',
      })
      .then((result) => {
        if (result.value) {
          this.confirmacionEntrega.folio = this.folio.folio;
          if (this.currentConfirmacionEntregaId === '') {
            this.confirmacionEntrega.entregado =
              this.frmConfirmacionEntrega.controls['entregado'].value;
            this.confirmacionEntregaService
              .create(this.confirmacionEntrega)
              .subscribe((response) => {});
          } else {
            this.confirmacionEntregaService
              .update(
                this.currentConfirmacionEntregaId,
                this.confirmacionEntrega
              )
              .subscribe((response) => {});
          }

          const dataForComentary: ISaveComentario = {
            folio: this.folio.folio,
            comentarios: this.frmConfirmacionEntrega.get('comentarios')?.value,
            actividad: this.folio.actividadCodigo,
          };

          if (!this.IDCOMENTARIO) {
            this.comentarioService
              .create(dataForComentary)
              .subscribe((response) => {
                const { _id } = response.data;
                this.IDCOMENTARIO = _id;
              });
          }

          const workflow: IWorlFlow = {
            folio: this.folio.folio,
            actividadInicial: this.folio.actividadCodigo,
            actividadFinal: KYCEActividad.FIN,
            actividad: KycEstatusBitacoraConsts.GESTIONADO,
            notificacion: ENotificacion.CONFIRMACION_ENTREGA,
            comentarios: this.frmConfirmacionEntrega.get('comentarios')?.value,
          };

          this.workflowService.avanzar(workflow).subscribe((response) => {
            this.swalService
              .success({
                text: 'Se finalizó correctamente la gestión del folio.',
              })
              .then(() => {
                this.router.navigate(['/bandejas']);
              });
          });
        }

        return;
      });
  }

  cargarMultiple(files: FileList | null) {
    let blnMensaje = false;
    if (files == null) return false;

    this.fileName = files[0].name;
    for (let i = 0; i < files!.length; i++) {
      const strExtension = files![i].name
        .split('.')
        [files![i].name.split('.').length - 1].toLowerCase();
      const lstExtensiones = this.allowedExtensions.split(',');

      if (lstExtensiones.includes('.' + strExtension)) {
        let archivo: IArchivo = {
          documento: '',
          nombreDocumento: '',
          titular: this.folio.titular,
          aseguradora: this.folio.aseguradoraId,
          file: files![i],
          nombreOriginal: files![i].name,
          vigencia: false,
          fechaVigencia: new Date(),
        };
        this.archivo = archivo;
      } else blnMensaje = true;
    }

    if (blnMensaje) {
      this.notifierService.warning(
        'Las extensiones permitidas son <br>' +
          this.allowedExtensions.split(',').join(' ')
      );
      this.fileName = '';
    }
    return;
  }

  async subirCarga(): Promise<boolean> {
    if (!this.archivo) {
      this.notifierService.warning('No hay ningún archivo seleccionado.');
      return false;
    }

    let contador = 0;
    this.isUploading = false;
    this.uploadProgress = 0;
    contador += 1;

    this.archivo.documento = this.documentoId;
    const formData: FormData = this.setFormData(this.archivo);
    const resp = await lastValueFrom(
      this.confirmacionEntregaService.uploadFile(formData)
    );

    this.confirmacionEntrega.archivos[0].expediente = resp.data._id;
    this.confirmacionEntrega.archivos[0].usuarioAlta = resp.data.usuarioAlta;
    this.confirmacionEntrega.archivos[0].fechaHoraAlta =
      resp.data.fechaHoraAlta;
    this.notifierService.success('El archivo se cargó correctamente');
    return true;
  }

  click_reenviarDocumentos() {
    const workflow: IWorlFlow = {
      folio: this.folio.folio,
      actividadInicial: this.folio.actividadCodigo,
      actividadFinal: KYCEActividad.CONFIRMACION_ENTREGA,
      actividad: KycEstatusBitacoraConsts.NONE,
      notificacion: ENotificacion.FORMATOS_FIRMADOS,
      // idDocumento: this.document_confirm_send_id,
      comentarios: this.frmConfirmacionEntrega.get('comentarios')?.value,
    };

    this.workflowService.reenviarFormatosFirmadosSolicitud(workflow).subscribe(
      (response) => {
        this.notifierService.success(
          'Se reenvío el correo de formatos firmados'
        );
        return;
      },
      (error) => {
        this.notifierService.error(
          'Ocurrió un error al reenviar el correo de formato firmado. Reinténtelo en un momento.'
        );
        return;
      }
    );
  }

  async getDocumento(): Promise<void> {
    const response = await lastValueFrom(
      this.admDocumentoService.getByClave(EDocumento.CONFIRMACION_ENTREGA)
    );
    this.documentoId = response.data._id;
  }

  validacionesFormulario(frm: FormGroup): boolean {
    const validaciones = frm.controls;

    if (!validaciones['entregado'].value) {
      this.notifierService.warning(
        'Debe estar activa la opción "Entregado" para continuar.'
      );
      return false;
    }

    const comentarios = validaciones['comentarios'].value;
    if (comentarios.trim() === '') {
      this.notifierService.warning(
        'Debe ingresar un comentario para continuar.'
      );
      return false;
    }

    return true;
  }

  setFormData(file: IArchivo): FormData {
    const formData = new FormData();
    formData.append('file', file!.file);
    formData.append('aseguradora', file.aseguradora);
    formData.append('titular', file.titular);
    formData.append('documento', file.documento);
    formData.append('nombreOriginal', file.nombreOriginal);
    formData.append('nombreDocumento', file.nombreDocumento);
    return formData;
  }

  return(): void {
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }
}
