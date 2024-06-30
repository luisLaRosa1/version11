import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { FileValidator } from 'src/app/shared/validators/file.validator';
import { KycFolioService } from '../../../services/kyc-folio.service';

@Component({
  selector: 'app-kyc-folio',
  templateUrl: './kyc-folio.component.html',
  styleUrls: ['./kyc-folio.component.scss'],
})
export class KycFolioComponent implements OnInit {
  @ViewChild('inputFile', { static: false }) fileInputRef!: ElementRef;

  allowedExtensions =
    AppConsts.SETTINGS.FILES.EXTENSIONS.FolioLayout.replaceAll(';', ',');

  file: File | null = null;
  frmFolio: FormGroup = <FormGroup>{};
  uploading: boolean = false;

  breadcrumbs: string[] = [
    'kyc.title',
    'kyc.core.folio.title',
    'kyc.core.folio.nuevo.title',
  ];

  constructor(
    private readonly notifierService: NotifierService,
    private readonly swalDialog: SwalService,
    private readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private folioService: KycFolioService
  ) {}

  ngOnInit(): void {
    this.frmFolio = this.formBuilder.group({
      file: ['', [Validators.required]],
    });
  }

  onDragover(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) this.handleFileInputChange(files);
  }

  handleFileInputChange(files: FileList | null): void {
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
        this.clear();
        return;
      }

      this.file = file;
      this.frmFolio.controls['file'].setValue(file.name);
    } else this.clear();
  }

  selectFile(input: any): void {
    if (!this.uploading) input.click();
  }

  clear(): void {
    if (this.fileInputRef) this.fileInputRef.nativeElement.value = '';
    this.frmFolio.reset();
    this.file = null;
    this.frmFolio.controls['file'].markAsUntouched();
  }

  upload(): void {
    if (
      !this.file ||
      this.frmFolio.invalid ||
      !/^[\w,\s-]+\.(xls|xlsx)$/i.test(this.file.name)
    ) {
      this.clear();
      this.notifierService.warning(
        this.translate.instant('kyc.core.folio.nuevo.requiredFile')
      );
      return;
    }

    this.uploading = true;
    this.frmFolio.controls['file'].disable();
    this.folioService
      .upload(this.file)
      .pipe(
        finalize(() => {
          this.uploading = false;
          this.frmFolio.controls['file'].enable();
          this.clear();
        })
      )
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success)
            this.swalDialog.success({
              title: this.translate.instant(
                'kyc.core.folio.nuevo.uploadSuccessful'
              ),
              text: response.message,
            });
          else console.error(response.message);
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
  }
}
