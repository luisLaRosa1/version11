import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppConsts } from '../../AppConsts';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  public toastrService = inject(ToastrService);

  success(message: string, title?: string): void {
    this.toastrService.success(
      message,
      title ?? AppConsts.SETTINGS.MESSAGES.TITLE.Success,
      {
        disableTimeOut: false,
        progressBar: true,
        closeButton: true,
        positionClass: 'toast-top-right',
        enableHtml: true,
      }
    );
  }

  error(message: string, title?: string): void {
    this.toastrService.error(
      message,
      title ?? AppConsts.SETTINGS.MESSAGES.TITLE.Error,
      {
        disableTimeOut: false,
        progressBar: true,
        closeButton: true,
        positionClass: 'toast-top-right',
        enableHtml: true,
      }
    );
  }

  warning(message: string, title?: string): void {
    this.toastrService.warning(
      message,
      title ?? AppConsts.SETTINGS.MESSAGES.TITLE.Warning,
      {
        disableTimeOut: false,
        progressBar: true,
        closeButton: true,
        positionClass: 'toast-top-right',
        enableHtml: true,
      }
    );
  }

  info(message: string, title?: string): void {
    this.toastrService.info(
      message,
      title ?? AppConsts.SETTINGS.MESSAGES.TITLE.Info,
      {
        disableTimeOut: false,
        progressBar: true,
        closeButton: true,
        positionClass: 'toast-top-right',
        enableHtml: true,
      }
    );
  }
}
