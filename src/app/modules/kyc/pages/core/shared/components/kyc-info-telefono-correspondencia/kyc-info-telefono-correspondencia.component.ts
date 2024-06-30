import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactoTelefonicoService } from 'src/app/modules/kyc/services/kyc.contacto-telefonico.service';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';

@Component({
  selector: 'app-kyc-info-telefono-correspondencia',
  templateUrl: './kyc-info-telefono-correspondencia.component.html',
  styleUrls: ['./kyc-info-telefono-correspondencia.component.scss'],
})
export class KycInfoTelefonoCorrespondenciaComponent {
  public activateSaveTelefonoCorrespondencia: boolean = false;
  public modalOpen = false;

  @Input() lstTelefonosCorrespondecia: any[] = [];
  @Input() modoConsulta: boolean = false;
  @Output() itemChanged: EventEmitter<any> = new EventEmitter();
  @Output() modalOpenChanged: EventEmitter<boolean> = new EventEmitter();

  messageTelefonosCorrespondecia: string = '';
  itemTelefonoCorrespondencia: any;
  displayedColumns: string[] = ['phone', 'extensions', 'edit', 'delete'];

  constructor(
    private swal: SwalService,
    private contactoTelefonicoService: ContactoTelefonicoService,
    private notifierService: NotifierService
  ) {}

  deletePhone(element: any) {
    this.swal
      .question({
        text: '¿Desea eliminar el registro seleccionado?',
        icon: 'question',
      })
      .then((result) => {
        if (result.value) {
          this.contactoTelefonicoService
            .deleteTelefonoCorrespondencia(element._id)
            .subscribe({
              next: (response: IResponse<any>) => {
                if (response.success) {
                  this.notifierService.success(response.message);
                  this.modalOpen = false;
                  this.modalOpenChanged.emit(this.modalOpen);
                }
              },
            });
        }
      });
  }

  editPhone(element: any) {
    this.itemTelefonoCorrespondencia = element;
    this.modalOpen = true;
    this.itemChanged.emit(this.itemTelefonoCorrespondencia);
    this.modalOpenChanged.emit(this.modalOpen);
  }
}
