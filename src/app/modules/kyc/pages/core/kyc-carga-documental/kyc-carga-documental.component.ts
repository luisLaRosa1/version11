import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';
import { IConfiguracionDocumental } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import {
  IArchivo,
  ICargaDocumentalMasivaCatalogs,
} from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import { IWorlFlow } from 'src/app/modules/administracion/helpers/interfaces/core-workflow';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { ValidacionService } from 'src/app/modules/administracion/services/core-validacion-documental';
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
import { IBandejaPaginate } from '../helpers/interfaces/bandeja';
import { IKycDocumentacion } from '../helpers/interfaces/kyc-documentacion';
import { IKycWorkflowDetalle } from '../helpers/interfaces/kyc-workflow';

@Component({
  selector: 'app-kyc-carga-documental',
  templateUrl: './kyc-carga-documental.component.html',
  styleUrls: ['./kyc-carga-documental.component.scss'],
})
export class KycCargaDocumentalComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator =
    {} as MatPaginator;
  comentarioLength: number = AppConsts.SETTINGS.VALIDATIONS.LENGTH.Comentario;

  breadcrumbs: string[] = ['Conoce a tu cliente', 'Carga documental'];
  public title: string = 'documento';
  public styleInput: string = 'background-white';
  userSession!: IUserStorageUserDto;
  displayedColumns: string[] = [
    'nombre',
    'documento',
    'fechaVigencia',
    'operaciones',
  ];

  isUploading: Boolean = false;
  uploadProgress: number = 0;
  dataSource = new MatTableDataSource<IArchivo>();
  dataArchivos: IArchivo[] = [];
  catalogos: ICargaDocumentalMasivaCatalogs = {};
  frmComentario = {} as FormGroup;
  IDCOMENTARIO: string | undefined = undefined;
  folio!: IBandejaPaginate;
  configuracion!: IConfiguracionDocumental;
  documentosObligatorios: any[] = [];
  readonlyModule: boolean = false;
  loading: boolean = true;
  validacion: any = {};
  documentos: IKycDocumentacion[] = [];
  pendientes: number = 0;
  documentosCargados: any[] = [];

  constructor(
    private notifierService: NotifierService,
    private userStorageService: UserStorageService,
    private workFlowActividadService: KycWorkFlowActividadService,
    private configuracionDocumentalService: AdmConfiguracionDocumentalService,
    private formBuilder: FormBuilder,
    private workflowService: KycWorkFlowService,
    private comentarioService: KycComentarioService,
    private swalService: SwalService,
    private expedienteService: KycExpedienteDigitalService,
    private validacionService: ValidacionService,
    private router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.frmComentario = this.formBuilder.group({
      folio: ['', [Validators.required]],
      actividad: ['', [Validators.required]],
      titular: ['', [Validators.required]],
      comentarios: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.userSession = this.userStorageService.getCurrentUserInfo();
    this.readonlyModule = history.state.readonlyModule || false;
    const folio = this.route.snapshot.paramMap.get('id') || undefined;

    if (!folio) {
      this.return();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(folio, KYCEActividad.CARGA_DOCUMENTAL)
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
            this.loadAction();
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

    if (this.readonlyModule) this.frmComentario.disable();
  }

  async getComentarios() {
    const response = await lastValueFrom(
      this.comentarioService.find(
        this.folio.folio,
        this.folio.actividadCodigo.toString()
      )
    );
    if (response.success && response.data.length > 0) {
      this.frmComentario.patchValue(response.data[0].actividades);
      this.IDCOMENTARIO = response.data[0]._id;
    }
  }

  loadAction() {
    this.configuracionDocumentalService
      .getConfiguracionDocumentalByProyecto(
        this.folio.proyecto,
        this.folio.aseguradoraId,
        this.folio.titular
      )
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {
            this.configuracion = response.data;
            this.catalogos.documento = response.data?.documento.filter(
              (element: any) => element.categoria == 1
            );
            this.configuracion.documento.forEach((element) => {
              if (element.categoria == 1) {
                this.documentos.push({
                  documento: element.documento,
                  nombre: element.nombre,
                  obligatorio: element.obligatorio,
                  pendiente: true,
                  clave: element.clave,
                });
              }
            });

            this.loadDocumentosObligatorios();
          } 
          else console.error(response.message);

          
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
  }

  async filesByTitular() {
    const documentosTitular = await lastValueFrom(
      this.expedienteService.find_by_Titular(
        this.folio.pais,
        this.folio.aseguradoraId,
        this.folio.proyecto,
        this.folio.titular
      )
    );
    if (documentosTitular.success) {
      this.documentosCargados = documentosTitular.data;
    }
    this.getValidacionDocumental();
  }

  loadDocumentosObligatorios() {
    this.expedienteService
      .check_by_titular(
        this.folio.pais,
        this.folio.aseguradoraId,
        this.folio.proyecto,
        this.folio.titular
      )
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {
            this.documentosObligatorios = response.data.filter(
              (element: any) =>
                element.clave !== EDocumento.FIC &&
                element.clave !== EDocumento.ANEXO &&
                element.clave !== EDocumento.ACUSE_ENVIO
            );

            this.documentos.map((element) => {
              let doc = this.documentosObligatorios.filter(
                (ob: any) => ob.clave == element.clave
              )[0];
              element.pendiente = false;
              if (doc != '' && doc != undefined) {
                element.pendiente = true;
              }
            });

            this.pendientes = this.documentos.filter(
              (element: any) => element.pendiente == true && element.obligatorio
            ).length;

            this.filesByTitular();
          } else console.error(response.message);
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
  }

  getValidacionDocumental() {
    this.validacionService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success && response.data !== null) {
            this.validacion = response.data;
            let incorrectos = response.data.archivos.filter(
              (element: any) => element.motivo > 0
            );

            this.documentos.map((element) => {
              let docIncorrectos = incorrectos.filter(
                (el: any) => el.documento == element.documento
              ).length;
              let cargados = this.documentosCargados.filter(
                (el: any) => el.clave == element.clave
              ).length;

              element.pendiente = false;
              if (cargados == 0 || docIncorrectos > 0) {
                element.pendiente = true;
              }
            });
            this.pendientes = this.documentos.filter(
              (element: any) => element.pendiente == true && element.obligatorio
            ).length;
          }
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
  }

  onDragover(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.styleInput = 'background-blue';
  }

  onDragout(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.styleInput = 'background-white';
  }

  onDrop(event: DragEvent) {
    this.styleInput = 'background-white';
  }

  onChangeDocumento(index: number, value: string) {
    this.dataArchivos[index].documento = value;
  }

  onChangeFechaVigencia(index: number, value: Date) {
    this.dataArchivos[index].fechaVigencia = value;
  }

  updateEventResponseEmitter(file: any) {
    if (this.validacion.archivos != undefined) {
      this.validacion.archivos.map((element: any) => {
        if (element?.documento === file.documento) {
          element.motivo = 0;
          element.correcto = false;
          element.expediente = file._id;
        }
      });
      this.validacionService
        .update(this.validacion._id, this.validacion)
        .subscribe((response) => {});
    }

    this.loadDocumentosObligatorios();
  }

  eliminaEspaciosCaracteres(texto: string) {
    return texto
      .normalize('NFD')
      .replace(
        /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
        '$1'
      )
      .normalize()
      .replace(/ /g, '');
  }

  async saveData() {
    if (this.frmComentario.valid) {
      if (this.IDCOMENTARIO == undefined) {
        this.comentarioService
          .create(this.frmComentario.value)
          .subscribe((response) => {
            const { _id } = response.data;
            this.IDCOMENTARIO = _id;
          });
      }

      if (!this.configuracion) {
        this.notifierService.warning(
          'Configuración documental no existe, favor de completar.'
        );
        return;
      }

      if (this.pendientes > 0) {
        const mensaje = this.generarMensajeHtml(this.documentos);
        this.swalService
          .question({
            html: `Se solicitarán los documentos ${mensaje} ¿Está de acuerdo?`,
          })
          .then((result) => {});
      } else {
        const workflow: IWorlFlow = {
          folio: this.folio.folio,
          actividadInicial: this.folio.actividadCodigo,
          actividadFinal: KYCEActividad.VALIDACION_DIGITAL,
          actividad: KycEstatusBitacoraConsts.EN_PROCESO_DE_GESTION,
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
    }
  }

  generarMensajeHtml(documentos: any[]): string {
    let mensaje = '';
    mensaje += "<div style='text-align: left'> </br>";
    mensaje += '<ul>';
    documentos.forEach((element: any) => {
      if (element.obligatorio && element.pendiente) {
        mensaje += '<li>';
        mensaje += element.nombre;
        mensaje += '</li>';
      }
    });
    mensaje += '</ul>';
    mensaje += '</div> </br>';
    return mensaje;
  }

  return(): void {
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }
}
