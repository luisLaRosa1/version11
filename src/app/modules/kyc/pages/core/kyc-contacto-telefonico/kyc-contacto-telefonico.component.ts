import { ENTER } from '@angular/cdk/keycodes';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';

import { MatChipInputEvent } from '@angular/material/chips';
import { EKycEstatusActividad } from 'src/app/modules/administracion/helpers/enums/kyc-estatus-actividad.enum';
import {
  IActividad,
  IWorlFlow,
} from 'src/app/modules/administracion/helpers/interfaces/core-workflow';
import { WorkFlowService } from 'src/app/modules/administracion/services/core.workflow.service';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { AppConsts } from 'src/app/shared/AppConsts';
import { ECatEstatusContactoTelefonico } from 'src/app/shared/helpers/enums/catalog/cat.estatus-contacto-telefonico.enum';
import { ECatTipoLlamada } from 'src/app/shared/helpers/enums/catalog/cat.tipo-llamada.enum';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { KycEstatusBitacoraConsts } from '../../../helpers/consts/core/kyc-estatus-bitacora.consts';
import { KycWorkFlowActividadService } from '../../../services/kyc-workflow-actividad.service';
import { ContactoTelefonicoService } from '../../../services/kyc.contacto-telefonico.service';
import { ENotificacion } from '../helpers/enums/notificacion.enum';
import { IBandejaPaginate } from '../helpers/interfaces/bandeja';
import {
  ICatalogos,
  IContactoTelefonico,
  IContactoTelefonicoPaginate,
  InformacionContactoDto,
  InformacionTelefonicaDto,
} from '../helpers/interfaces/contacto-telefonico';
import { IKycFlujoConsulta } from '../helpers/interfaces/kyc-flujo-consulta';
import { IKycWorkflowDetalle } from '../helpers/interfaces/kyc-workflow';
import { IResponse } from './../../../../../shared/helpers/interfaces/response';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-kyc-contacto-telefonico',
  templateUrl: './kyc-contacto-telefonico.component.html',
  styleUrls: ['./kyc-contacto-telefonico.component.scss'],
})
export class KycContactoTelefonicoComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('chipGrid') chipGrid: any;

  PATTERN_EMAIL: RegExp = AppConsts.SETTINGS.PATTERNS.EmailAddress;

  readonly separatorKeysCodes = [ENTER] as const;
  public modalOpen = false;
  dataSource = new MatTableDataSource();

  actividades!: IActividad[];
  breadcrumbs: string[] = ['Conoce a tu cliente', 'Contacto telefonico'];
  itemsPorPage = AppConsts.SETTINGS.COMPONENTS.TABLE.ItemsPorPage;
  catalogos!: ICatalogos;
  estatus!: Array<ICatalogo>;
  estatusAux: Array<ICatalogo> = [];
  contacto: Array<IContactoTelefonicoPaginate> = [];
  displayColumns = [
    'fechaContacto',
    'usuario',
    'tipoLlamada',
    'estatus',
    'fechaProximaLlamada',
    'observaciones',
  ];

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'fechaContacto',
    sort: 'desc',
    search: '',
  };

  frmContactoTelefonico!: FormGroup;
  frmInformacionContacto!: FormGroup;
  catalogs!: ICatalogos;
  itemTelefonoCorrespondencia: any;
  lstTelefonosCorrespondecia: InformacionTelefonicaDto[] = [];
  folio!: IBandejaPaginate;
  correos: any = [];
  currentIdContacto: string | undefined = '';
  readonlyModule: boolean = false;
  flujoConsulta!: IKycFlujoConsulta;

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly notifierService: NotifierService,
    private formBuilder: FormBuilder,
    private contactoTelefonicoService: ContactoTelefonicoService,
    private workflowService: WorkFlowService,
    private swalService: SwalService,
    private userStorageService: UserStorageService,
    private workFlowActividadService: KycWorkFlowActividadService
  ) { }

  ngOnInit(): void {
    this.loadForm();
    this.init();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onChangePage(e: PageEvent): void {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.findAll();
  }

  sortChange(sort: { active: string; direction: string }): void {
    this.paginateParams.sort = sort.direction;
    this.paginateParams.order = sort.active;
    this.length = 0;
    this.pageIndex = 0;
    this.findAll();
  }

  init(): void {
    const folio = this.route.snapshot.paramMap.get('id') || undefined;
    this.readonlyModule = history.state.readonlyModule || false;

    if (!folio) {
      this.return();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(folio, KYCEActividad.CONTACTO_TELEFONICO)
      .subscribe({
        next: (response: IResponse<IKycWorkflowDetalle>) => {
          if (response.success) {
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;
            this.loadInformacionContacto();
            this.loadCatalogos();
            this.findAll();
            this.getTelefonosCorrespondecia();
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

    if (this.readonlyModule) {
      this.frmContactoTelefonico.disable();
      this.frmInformacionContacto.disable();
    }
  }

  loadForm(): void {
    this.frmContactoTelefonico = this.formBuilder.group({
      idTipoLlamada: ['', [Validators.required]],
      idEstatusLlamada: ['', [Validators.required]],
      fechaProximaLlamada: new UntypedFormControl({
        value: '',
        disabled: true,
      }),
      observaciones: ['', [Validators.required]],
    });

    this.frmInformacionContacto = this.formBuilder.group({
      nombre: new UntypedFormControl('', [Validators.required]),
      tipo: new UntypedFormControl('', [Validators.required]),
      emailCorrespondencia: new UntypedFormControl(''),
      correos: new UntypedFormControl('', [Validators.email]),
    });
  }

  loadInformacionContacto(): void {
    this.contactoTelefonicoService
      .getInformacionContacto(this.folio.folio)
      .subscribe({
        next: (response: IResponse<InformacionContactoDto>) => {
          if (response.success) {
            const newobject = {
              nombre: response.data.nombre,
              tipo: response.data.tipo,
            };
            this.currentIdContacto = response.data._id;
            this.getDataEmail(response.data.correos);
            this.frmInformacionContacto.patchValue(newobject);
          }
        },
      });
  }

  loadCatalogos(): void {
    this.contactoTelefonicoService
      .getCatalogos()
      .subscribe((catalogos: IResponse<ICatalogos>) => {
        this.catalogos = catalogos.data;
        this.estatus = this.catalogos.estatus;
        this.setEstatus();
      });
  }

  setEstatus(): void {
    this.workflowService
      .getInfoFolioActividades(
        this.folio.folioMultisistema,
        this.folio.proyecto
      )
      .subscribe({
        next: (response: IResponse<IActividad[]>) => {
          if (response.success) {
            this.actividades = response.data.filter(
              (x) =>
                x.estatus != EKycEstatusActividad.COMPLETADA &&
                x.actividad != KYCEActividad.CONTACTO_TELEFONICO
            );

            if (this.actividades.length > 0)
              this.changeEstatusByActividad(this.actividades[0].actividad);
          }
        },
      });
  }

  changeEstatusByActividad(actividad: KYCEActividad): void {

    switch (actividad) {
      case KYCEActividad.VALIDACION_DIGITAL:
      case KYCEActividad.CARGA_DOCUMENTAL:
        this.estatus = this.estatus.filter((e) =>
          [
            ECatEstatusContactoTelefonico.DATOS_DE_CONTACTO_INCORRECTOS,
            ECatEstatusContactoTelefonico.NO_CONTESTA,
            ECatEstatusContactoTelefonico.EN_ESPERA_DE_DOCUMENTOS_DIGITALES,
            ECatEstatusContactoTelefonico.NO_DESEA_CONTINUAR_CON_EL_TRAMITE,
            ECatEstatusContactoTelefonico.TELEFONO_INCORRECTO,
            ECatEstatusContactoTelefonico.TELEFONO_SUSPENDIDO,
            ECatEstatusContactoTelefonico.SE_CONTACTO_CLIENTE
          ].includes(e.clave)
        );
        break;

      case KYCEActividad.FIRMA_CLIENTE:
        this.estatus = this.estatus.filter((e) =>
          [
            ECatEstatusContactoTelefonico.NO_CONTESTA,
            ECatEstatusContactoTelefonico.NO_DESEA_CONTINUAR_CON_EL_TRAMITE,
            ECatEstatusContactoTelefonico.EN_ESPERA_DE_FIRMA_CLIENTE,
            ECatEstatusContactoTelefonico.TELEFONO_INCORRECTO,
            ECatEstatusContactoTelefonico.TELEFONO_SUSPENDIDO,
            ECatEstatusContactoTelefonico.SE_CONTACTO_CLIENTE
          ].includes(e.clave)
        );
        break;

      case KYCEActividad.FIRMA_EJECUTIVO:
        this.estatus = this.estatus.filter((e) =>
          [
            ECatEstatusContactoTelefonico.NO_CONTESTA,
            ECatEstatusContactoTelefonico.NO_DESEA_CONTINUAR_CON_EL_TRAMITE,
            ECatEstatusContactoTelefonico.EN_ESPERA_DE_FIRMA_EJECUTIVO,
            ECatEstatusContactoTelefonico.TELEFONO_INCORRECTO,
            ECatEstatusContactoTelefonico.TELEFONO_SUSPENDIDO,
            ECatEstatusContactoTelefonico.SE_CONTACTO_CLIENTE
          ].includes(e.clave)
        );
        break;

      case KYCEActividad.VALIDACION_FIRMAS:
        this.estatus = this.estatus.filter((e) =>
          [
            ECatEstatusContactoTelefonico.NO_CONTESTA,
            ECatEstatusContactoTelefonico.NO_DESEA_CONTINUAR_CON_EL_TRAMITE,
            ECatEstatusContactoTelefonico.VALIDANDO_FIRMAS,
            ECatEstatusContactoTelefonico.TELEFONO_INCORRECTO,
            ECatEstatusContactoTelefonico.TELEFONO_SUSPENDIDO,
            ECatEstatusContactoTelefonico.SE_CONTACTO_CLIENTE
          ].includes(e.clave)
        );
        break;

      case KYCEActividad.CONFIRMACION_ENTREGA:
        this.estatus = this.estatus.filter((e) =>
          [
            ECatEstatusContactoTelefonico.NO_CONTESTA,
            ECatEstatusContactoTelefonico.NO_DESEA_CONTINUAR_CON_EL_TRAMITE,
            ECatEstatusContactoTelefonico.FORMATOS_ENVIADOS_A_ASEGURADORA,
            ECatEstatusContactoTelefonico.TELEFONO_INCORRECTO,
            ECatEstatusContactoTelefonico.TELEFONO_SUSPENDIDO,
            ECatEstatusContactoTelefonico.SE_CONTACTO_CLIENTE
          ].includes(e.clave)
        );
        break;
    }

    this.estatusAux = this.estatus;
  }

  onSelectionChangeTipoLlamada(idEstatusLlamada: ECatTipoLlamada): void {

    if (idEstatusLlamada === ECatTipoLlamada.ENTRANTE) {
      this.estatus = this.estatusAux.filter(
        (e) => e.clave !== ECatEstatusContactoTelefonico.NO_CONTESTA &&
          e.clave !== ECatEstatusContactoTelefonico.TELEFONO_INCORRECTO &&
          e.clave !== ECatEstatusContactoTelefonico.TELEFONO_SUSPENDIDO
      );
    } else { 
      this.estatus = this.estatusAux.filter(
        (e) => e.clave !== ECatEstatusContactoTelefonico.SE_CONTACTO_CLIENTE
      );
    }
  }

  onSelectionChangeEstatus(idEstatus: number): void {
    this.contactoTelefonicoService
      .getFechaProximaLlamada(idEstatus)
      .subscribe((response: IResponse<any>) => {
        const fecha = moment(response.data.fechaProximaLlamada).format(
          AppConsts.SETTINGS.FORMATS.Datetime
        );
        this.frmContactoTelefonico.controls['fechaProximaLlamada'].setValue(
          fecha
        );
      });
  }

  agregarContacto(): void {
    const contactoTelefonico: IContactoTelefonico = {
      folio: this.folio.folio,
      tipoLlamada: this.frmContactoTelefonico.value.idTipoLlamada,
      observaciones: this.frmContactoTelefonico.value.observaciones,
      estatus: this.frmContactoTelefonico.value.idEstatusLlamada,
    };

    const idEstatus: ECatEstatusContactoTelefonico =
      this.frmContactoTelefonico.value.idEstatusLlamada;

    if (this.frmContactoTelefonico.invalid) {
      this.frmContactoTelefonico.markAllAsTouched();
      return;
    }

    if (this.frmContactoTelefonico.valid) {
      switch (idEstatus) {
        //Avanza Actividad
        case ECatEstatusContactoTelefonico.DATOS_DE_CONTACTO_INCORRECTOS:
          let workflowca: IWorlFlow = {
            folio: this.folio.folio,
            actividadInicial: this.folio.actividadCodigo,
            actividadFinal: KYCEActividad.CONTACTO_ASEGURADORA,
            actividad: KycEstatusBitacoraConsts.DATOS_DE_CONTACTO_INCORRECTOS,
            notificacion: ENotificacion.DATOS_CONTACTO,
            comentarios: contactoTelefonico.observaciones,
          };

          this.insert(contactoTelefonico);
          this.workflowService.avanzar(workflowca).subscribe({
            next: (response: IResponse<any>) => {
              if (response.success) {
                workflowca.actividadInicial = this.actividades[0].actividad;
                this.workflowService.completar(workflowca).subscribe();
                this.swalService
                  .success({
                    html: 'Información almacenada correctamente, se avanzó la actividad a <b>Contacto Aseguradora</b>',
                  })
                  .then((okay) => {
                    this.router.navigate(['/bandejas']);
                  });
              }
            },
          });

          break;

        //Se cambia a Bandejas Programadas
        case ECatEstatusContactoTelefonico.NO_CONTESTA:
        case ECatEstatusContactoTelefonico.EN_ESPERA_DE_DOCUMENTOS_DIGITALES:
        case ECatEstatusContactoTelefonico.EN_ESPERA_DE_FIRMA_CLIENTE:
        case ECatEstatusContactoTelefonico.EN_ESPERA_DE_FIRMA_EJECUTIVO:
        case ECatEstatusContactoTelefonico.VALIDANDO_FIRMAS:
        case ECatEstatusContactoTelefonico.FORMATOS_ENVIADOS_A_ASEGURADORA:
        case ECatEstatusContactoTelefonico.TELEFONO_INCORRECTO:
        case ECatEstatusContactoTelefonico.TELEFONO_SUSPENDIDO:
        case ECatEstatusContactoTelefonico.SE_CONTACTO_CLIENTE:
          this.insert(contactoTelefonico);
          this.contactoTelefonicoService
            .updateToBandejaProgramada(
              this.folio.folioMultisistema,
              this.folio.actividadCodigo
            )
            .subscribe({
              next: (response: IResponse<any>) => {
                if (response.success) {
                  this.swalService
                    .success({
                      html: 'Información almacenada correctamente, la actividad se encuentra en la <b>Bandeja Programadas</b>',
                    })
                    .then((okay) => {
                      this.router.navigate(['/bandejas']);
                    });
                }
              },
            });
          break;

        //No realiza ninguna acción
        // case ECatEstatusContactoTelefonico.EN_ESPERA_DE_DOCUMENTOS_DIGITALES:
        //   this.insert(contactoTelefonico, true);
        //   break;

        //Se finaliza
        case ECatEstatusContactoTelefonico.NO_DESEA_CONTINUAR_CON_EL_TRAMITE:
          let workflowda: IWorlFlow = {
            folio: this.folio.folio,
            actividadInicial: this.folio.actividadCodigo,
            actividadFinal: KYCEActividad.FIN,
            actividad: KycEstatusBitacoraConsts.NONE,
            comentarios: contactoTelefonico.observaciones,
            notificacion: ENotificacion.NO_CONTINUA_PROCESO,
          };
          this.swalService
            .question({
              html: 'El folio se finalizará, ¿Esta seguro?',
            })
            .then((response) => {
              if (response.isConfirmed) {
                this.insert(contactoTelefonico);
                this.contactoTelefonicoService
                  .finalizaActividad(
                    this.folio.folioMultisistema,
                    this.folio.folio,
                    this.folio.actividadCodigo,
                    contactoTelefonico.observaciones
                  )
                  .subscribe({});
                this.workflowService
                  .notificacionNoContinuaProceso(workflowda)
                  .subscribe({});
                this.router.navigate(['/bandejas']);
              }
            });
          break;
      }
    }
  }

  insert(contactoTelefonico: IContactoTelefonico, flag: boolean = false): void {
    this.contactoTelefonicoService.insert(contactoTelefonico).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          this.limpiarCampos();
          this.findAll();
          if (flag) {
            this.swalService
              .success({
                html: response.message,
              })
              .then((okay) => {
                this.router.navigate(['/bandejas']);
              });
          }
        }
      },
      error: (err) => this.notifierService.warning(err?.error?.message),
    });
  }

  findAll(): void {
    this.contactoTelefonicoService
      .findAll(this.folio.folio, this.paginateParams)
      .subscribe(
        (response: IResponse<IPaginate<IContactoTelefonicoPaginate>>) => {
          if (response.success) {
            this.dataSource.data = response.data.docs;
            this.length = response.data.totalDocs;
          }
        }
      );
  }

  actualizarContacto(): void {
    if (this.lstTelefonosCorrespondecia.length === 0) {
      this.swalService.info({
        text: 'No se ha registrado la información telefónica del contacto.',
      });
      return;
    }

    this.validateEmail();

    if (this.frmInformacionContacto.valid) {
      this.validateEmail();
      const email = this.getEmail();
      this.frmInformacionContacto.get('emailCorrespondencia')?.setValue(email);

      let informacionContacto: InformacionContactoDto = {
        folio: this.folio.folio,
        nombre: this.frmInformacionContacto.value.nombre,
        tipo: this.frmInformacionContacto.value.tipo,
        correos: this.frmInformacionContacto.value.emailCorrespondencia
          .toString()
          .split(','),
      };

      this.contactoTelefonicoService
        .updateInformacionContacto(this.currentIdContacto!, informacionContacto)
        .subscribe({
          next: (response: IResponse<InformacionContactoDto>) => {
            if (response.success) {
              this.notifierService.success(response.message);
            }
          },
          error: (err) => this.notifierService.error(err?.error?.message),
        });
    } else {
      if (this.frmInformacionContacto.invalid) {
        this.frmInformacionContacto.markAllAsTouched();
        return;
      }
    }
  }

  getTelefonosCorrespondecia(): void {
    this.contactoTelefonicoService
      .getTelefonosCorrespondencia(this.folio.folio)
      .subscribe({
        next: (response: IResponse<InformacionTelefonicaDto[]>) => {
          if (response.success) {
            this.lstTelefonosCorrespondecia = response.data;
          }
        },
      });
  }

  limpiarCampos(): void {
    this.frmContactoTelefonico.controls['fechaProximaLlamada'].setValue('');
    this.frmContactoTelefonico.controls['observaciones'].setValue(' ');
    this.frmContactoTelefonico.controls['idTipoLlamada'].setValue(0);
    this.frmContactoTelefonico.controls['idEstatusLlamada'].setValue(0);
  }

  getDataEmail(email: string[]) {
    email?.forEach((x) => {
      if (x !== '') {
        if (this.validateEmailPattern(x)) {
          this.correos.push({ name: x, invalid: false });
        } else {
          this.correos.push({ name: x, invalid: true });
        }
      }
    });
  }

  checkValidEmail(): void {
    this.chipGrid.errorState = this.correos.length == 0;
    let correo = this.frmInformacionContacto.get('correos');
    correo?.patchValue(this.correos.join(','));
    correo?.setErrors(this.correos.length == 0 ? { required: true } : null);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value == '') return;

    if (!this.PATTERN_EMAIL.test(value)) {
      this.notifierService.warning('Escriba un correo electrónico valido');
      event.chipInput.clear();
      return;
    }

    if (this.correos.filter((f: any) => f.name == value).length > 0) {
      this.notifierService.info('El correo electrónico ya esta registrado');
      event.chipInput.clear();
      return;
    }

    this.correos.push({ name: value, invalid: false });

    this.checkValidEmail();
    event.chipInput.clear();
  }

  remove(email: string): void {
    const index = this.correos.indexOf(email);
    if (index >= 0) this.correos.splice(index, 1);
    this.checkValidEmail();
  }

  validateEmailPattern(email: string) {
    var re = AppConsts.SETTINGS.PATTERNS.EmailAddress;
    return re.test(String(email).toLowerCase());
  }

  onItemChanged(item: any) {
    this.itemTelefonoCorrespondencia = item;
  }

  onModalOpenChanged(open: boolean) {
    this.modalOpen = open;
    this.getTelefonosCorrespondecia();
  }

  getEmail(): string {
    let email = '';
    this.correos.map((element: any) => {
      if (this.correos.length > 1) {
        email += element.name + ',';
      } else {
        email += element.name;
      }
    });

    if (email.charAt(email.length - 1) == ',')
      email = email.substring(0, email.length - 1);
    return email;
  }

  validateEmail() {
    if (this.correos.length == 0) {
      this.chipGrid.errorState = true;
      this.frmInformacionContacto
        .get('emailCorrespondencia')
        ?.setErrors({ incorrect: true });
    }

    if (
      this.correos.length > 0 &&
      this.correos.filter((f: any) => f.invalid).length > 0
    ) {
      this.chipGrid.errorState = true;
      this.frmInformacionContacto
        .get('emailCorrespondencia')
        ?.setErrors({ incorrect: true });
    }

    if (
      this.correos.length > 0 &&
      this.correos.filter((f: any) => !f.invalid).length == this.correos.length
    ) {
      this.chipGrid.errorState = false;
      this.frmInformacionContacto.get('emailCorrespondencia')?.setErrors(null);
    }
  }

  closeModal($event: any): void {
    this.itemTelefonoCorrespondencia = null;
    this.modalOpen = false;
    this.getTelefonosCorrespondecia();
  }

  cancelar(): void {
    this.router.navigate(['/bandejas']);
  }

  return(): void {
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }
}
