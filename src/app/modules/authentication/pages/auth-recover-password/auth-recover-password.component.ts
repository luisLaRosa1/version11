import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-recover-password',
  templateUrl: './auth-recover-password.component.html',
  styleUrls: ['./auth-recover-password.component.scss'],
})
export class AuthRecoverPasswordComponent implements OnInit, AfterViewInit {
  @ViewChild('inputEmail') inputEmail!: ElementRef;

  form: FormGroup = <FormGroup>{};

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(AppConsts.SETTINGS.PATTERNS.EmailAddress),
        ],
      ],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inputEmail.nativeElement.focus();
    }, 100);
  }

  submit(): void {
    const body = this.form.value;
    this.authService.recoverPassword(body).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          this.notifierService.success(response.message);
          this.router.navigateByUrl('/authentication/login');
        } else this.notifierService.warning(response.message);
      },
      error: (error) => this.notifierService.warning(error.error.message),
    });
  }
}
