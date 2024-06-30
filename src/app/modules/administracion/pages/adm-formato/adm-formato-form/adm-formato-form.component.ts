import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDocumento } from 'src/app/modules/administracion/helpers/interfaces/adm-documento';
import { AdmFormatoKycService } from 'src/app/modules/administracion/services/adm-formato.service';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { AppConsts } from 'src/app/shared/AppConsts';
import { ECategoriaDocumento } from 'src/app/shared/helpers/enums/core/categoria-documento.enum';
import { EFormAction } from 'src/app/shared/helpers/enums/form-action.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { FileValidator } from 'src/app/shared/validators/file.validator';
import { FormActionValidator } from 'src/app/shared/validators/form-action.validator';
import {
  IAseguradoraCatalog,
  IFormatoKYC,
  IFormatoKycCatalogs,
  IFormatoKycEdit,
  IProyectoCatalog,
} from '../../../helpers/interfaces/adm-formato';
import { debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-kyc-formato-form',
  templateUrl: './adm-formato-form.component.html',
})
export class AdmFormatoFormComponent {
  @ViewChild('inputFile', { static: false }) fileInputRef!: ElementRef;

  allowedExtensions = AppConsts.SETTINGS.FILES.EXTENSIONS.FormatoKyc.replaceAll(
    ';',
    ','
  );

  frmFormatoKyc: FormGroup = <FormGroup>{};
  breadcrumbs: Array<string> = ['Administración', 'Formatos'];
  title: string = 'Nuevo';
  action!: EFormAction;

  currentFormatoId: string | null = null;
  currentCountry: ICatalogoPais | undefined = undefined;

  paises: Array<ICatalogoPais> = [];
  aseguradora: Array<IAseguradoraCatalog> = [];
  aseguradoraAux: Array<IAseguradoraCatalog> = [];
  proyectoAux: Array<IProyectoCatalog> = [];
  proyecto: Array<IProyectoCatalog> = [];
  tipoPersona: Array<ICatalogo> = [];
  tipoPersonaAux: Array<ICatalogo> = [];
  documentoAux: Array<IDocumento> = [];
  documento: Array<IDocumento> = [];

  tipoPersonaArray: Array<number> = [1, 2];
  selectedObjects!: any[];
  files: FileList | null = null;
  //nombreOriginal: string = '';

  formAction = {
    CREATE: EFormAction.CREATE,
    VIEW: EFormAction.VIEW,
  };

  constructor(
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private formatoKycService: AdmFormatoKycService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkActivatedRoute();
    this.selectAseguradora();
    this.selectedObjects = [];
  }

  selectAseguradora(){
    this.frmFormatoKyc.get('aseguradora')?.valueChanges.pipe(
      debounceTime(600),
      switchMap(value => this.formatoKycService.getCatalogs(value || null)))
      .subscribe({
        next: (response: IResponse<IFormatoKycCatalogs>) => {
          if (response.success) {
            this.aseguradora = response.data.aseguradora;
          }
        },
        error: (err) => {
          this.notifierService.warning(err?.error?.message);
        }
    });
  }

  initForm(): void {
    this.frmFormatoKyc = this.formBuilder.group({
      file: ['', [Validators.required]],
      nombre: [''],
      pais: [0, [Validators.required, Validators.min(1)]],
      proyecto: ['', [Validators.required, Validators.min(8)]],
      aseguradora: ['', [Validators.required, Validators.min(8)]],
      documento: ['', [Validators.required, Validators.min(8)]],
      tipoPersona: [0, [Validators.required, Validators.min(1)]],
    });

    this.frmFormatoKyc.controls['pais'].valueChanges.subscribe((clave) => {
      this.currentCountry = this.paises.find((p) => p.clave == clave);
      this.aseguradora = [
        ...new Set(
          this.aseguradoraAux.filter((element) => element.pais === clave)
        ),
      ];
      this.proyecto = [
        ...new Set(
          this.proyectoAux.filter((element) => element.pais === clave)
        ),
      ];
      this.tipoPersona = [
        ...new Set(
          this.tipoPersonaAux.filter((element) => element.pais === clave)
        ),
      ];
      this.documento = [
        ...new Set(
          this.documentoAux.filter((element) => element.pais === clave)
        ),
      ];
    });
  }

  onChangeTipoPersona(index: number, value: number) {
    const registroExiste = this.tipoPersonaArray.includes(value);
    if (registroExiste) return;
    this.tipoPersonaArray.push(Number(value));
  }

  checkActivatedRoute(): void {
    this.activatedRoute.params.subscribe((p) => {
      const result = FormActionValidator.checkRoute(
        this.activatedRoute.snapshot.routeConfig?.path,
        p['id']
      );

      if (!result) {
        this.router.navigateByUrl(`administracion/formatos`);
        return;
      }

      this.currentFormatoId = result.id;
      this.action = result.action;

      this.checkActionAndLoad(this.currentFormatoId);
    });
  }

  checkActionAndLoad(_id: string | null): void {
    if (_id) {
      if (this.action === EFormAction.VIEW) this.frmFormatoKyc.disable();

      this.formatoKycService.getByIdAndGetCatalogosToEdit(_id).subscribe({
        next: (response: IResponse<IFormatoKycEdit>) => {
          if (response.success) {
            const { formatoKyc, catalogos } = response.data;
            this.paises = catalogos.paises;
            this.aseguradoraAux = [
              ...new Set(
                catalogos.aseguradora.filter((element) => element.documentos)
              ),
            ];
            this.aseguradora = [
              ...new Set(
                this.aseguradoraAux.filter(
                  (element) => element.pais === formatoKyc?.pais
                )
              ),
            ];
            this.proyectoAux = catalogos.proyecto;
            this.proyecto = [
              ...new Set(
                this.proyectoAux.filter(
                  (element) => element.pais === formatoKyc?.pais
                )
              ),
            ];
            this.tipoPersonaAux = catalogos.tipoPersona;
            this.tipoPersona = [
              ...new Set(
                this.tipoPersonaAux.filter(
                  (element) => element.pais === formatoKyc?.pais
                )
              ),
            ];

            this.documento = catalogos.documento;

            const getNameAseguradora = this.aseguradoraAux.find((p) => p._id == formatoKyc.aseguradora);
            formatoKyc.aseguradora = getNameAseguradora?.nombreComercial??'';

            this.frmFormatoKyc.patchValue(formatoKyc);
          } else console.error(response.message);
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
    } else {
      this.formatoKycService.getCatalogs().subscribe({
        next: (response: IResponse<IFormatoKycCatalogs>) => {
          if (response.success) {
            this.paises = response.data.paises;
            this.aseguradoraAux = [
              ...new Set(
                response.data.aseguradora.filter(
                  (element) => element.documentos
                )
              ),
            ];
            this.aseguradora = this.aseguradoraAux;
            this.proyectoAux = response.data.proyecto;
            this.proyecto = response.data.proyecto;
            this.tipoPersonaAux = response.data.tipoPersona;
            this.documentoAux = [
              ...new Set(
                response.data.documento.filter(
                  (x) =>
                    x.activo &&
                    x.categoria === ECategoriaDocumento.COMPLEMENTARIOS &&
                    x.nombre != 'Confirmación de entrega'
                )
              ),
            ];
          }
        },
      });
    }
  }

  getSelectedFiles(files: FileList | null): void {

    if (files && files.length === 1) {
      const file = files[0];

      if (
        !FileValidator.isAllowedFile(
          file.name,
          this.allowedExtensions.split(',')
        )
      ) {
        this.notifierService.error(
          `Solo se permite cargar archivos con extensión (${this.allowedExtensions
            .replaceAll('.', '*.')
            .toUpperCase()})`
        );

        this.fileClear();
        return;
      }

      this.files = files;
      this.frmFormatoKyc.controls['file'].setValue(files[0].name);
    } else this.fileClear();
  }

  fileClear(): void {
    if (this.fileInputRef) this.fileInputRef.nativeElement.value = '';
    this.files = null;
    this.frmFormatoKyc.controls['file'].setValue('');
  }

  submit(): void {
    if (this.action === EFormAction.VIEW) return;

    if (this.frmFormatoKyc.invalid) {
      this.frmFormatoKyc.markAllAsTouched();
      return;
    }

    if (!this.files || this.files.length === 0) {
      this.notifierService.warning('Debe seleccionar un archivo');
      return;
    }

    const formatoKyc: IFormatoKYC = <IFormatoKYC>this.frmFormatoKyc.value;

    const asegu = this.aseguradora.filter((element) => element.nombreComercial === formatoKyc.aseguradora);
    formatoKyc.aseguradora = asegu[0]._id;

    const formData: FormData = this.setDataFormData(formatoKyc);

    this.formatoKycService.create(formData).subscribe({
      next: (response: IResponse<IFormatoKYC>) => {
        if (response.success) {
          this.return();
          this.notifierService.success(response.message);
        } else console.error(response.message);
      },
      error: (err) => this.notifierService.error(err?.error?.message),
    });
  }

  return(): void {
    this.router.navigateByUrl(`/administracion/formatos`);
  }

  setDataFormData(formatoKyc: IFormatoKYC): FormData {
    const file: File | null = this.files![0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nombre', formatoKyc.nombre);
    formData.append('proyecto', formatoKyc.proyecto);
    formData.append('pais', formatoKyc.pais.toString());
    formData.append('aseguradora', formatoKyc.aseguradora.toString());
    formData.append('documento', formatoKyc.documento);
    formData.append('tipoPersona', formatoKyc.tipoPersona.toString());
    return formData;
  }
}
