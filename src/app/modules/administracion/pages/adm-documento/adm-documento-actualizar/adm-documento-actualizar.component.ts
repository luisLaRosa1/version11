import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { IDocumento } from '../../../helpers/interfaces/adm-documento';
import { AdmDocumentoService } from '../../../services/adm-documento.service';

@Component({
  selector: 'app-adm-documento-actualizar',
  templateUrl: './adm-documento-actualizar.component.html',
})
export class AdmDocumentoActualizarComponent {
  idDocumento: string = '';
  isInvalidForm: boolean = true;

  constructor(
    private documentoService: AdmDocumentoService,
    private router: Router,
    private readonly notifierService: NotifierService,
    private route: ActivatedRoute
  ) {}

  editarDocumento(documento: IDocumento) {
    if (this.isInvalidForm) {
      return;
    }

    this.route.params.subscribe((params) => {
      this.idDocumento = params['id'];

      if (this.idDocumento) {
        this.documentoService.update(this.idDocumento, documento).subscribe({
          next: (response: IResponse<IDocumento>) => {
            if (response.success) {
              this.return();
              this.notifierService.success(response.message);
            } else console.error(response.message);
          },
          error: (err) => this.notifierService.error(err?.error?.message),
        });
      }
    });
  }

  cancelButton(value: boolean) {
    this.router.navigate(['administracion/documentos']);
  }

  return(): void {
    this.router.navigateByUrl(`/administracion/documentos`);
  }

  validarForm(valor: boolean) {
    this.isInvalidForm = valor;
  }
}
