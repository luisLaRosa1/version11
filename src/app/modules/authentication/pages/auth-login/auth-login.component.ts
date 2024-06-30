import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import {
  ILoginDto,
  ILoginResponseDto,
} from '../../helpers/interfaces/login.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
})
export class AuthLoginComponent implements OnInit, AfterViewInit {
  @ViewChild('inputEmail') inputEmail!: ElementRef;

  frmLogin: FormGroup = <FormGroup>{};
  hiddenPassword = true;
  logging: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notifierService: NotifierService,
    private userStorageService: UserStorageService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inputEmail.nativeElement.focus();
    }, 100);
  }

  ngOnInit(): void {
    sessionStorage.clear();
    this.frmLogin = this.formBuilder.group({
      correoElectronico: [
        '',
        [
          Validators.required,
          Validators.pattern(AppConsts.SETTINGS.PATTERNS.EmailAddress),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.logging) return;

    if (this.frmLogin.invalid) {
      this.frmLogin.markAllAsTouched();
      return;
    }

    this.frmLogin.disable();
    this.logging = true;

    const login: ILoginDto = <ILoginDto>this.frmLogin.value;
    this.authService
      .login(login)
      .pipe(
        finalize(() => {
          this.logging = false;
          this.frmLogin.enable();
        })
      )
      .subscribe({
        next: (response: IResponse<ILoginResponseDto>) => {
          if (response.success) {
            this.userStorageService.init(response.data);
          } else this.notifierService.warning(response.message);
        },
        error: (error) => this.notifierService.warning(error?.error?.message),
      });
  }
}
