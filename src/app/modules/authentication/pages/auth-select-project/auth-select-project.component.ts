import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { ISessionToken } from '../../helpers/interfaces/auth.interface';
import {
  ILoginProyectoDto,
  ILoginRolDto,
  ISelectProjectDto,
} from '../../helpers/interfaces/login.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-select-project',
  templateUrl: './auth-select-project.component.html',
  styleUrls: ['./auth-select-project.component.scss'],
})
export class AuthSelectProjectComponent implements OnInit {
  frmLogin: FormGroup = <FormGroup>{};
  proyecto!: ILoginProyectoDto;
  roles: Array<ILoginRolDto> = [];

  constructor(
    private formBuilder: FormBuilder,
    private userStorageService: UserStorageService,
    private readonly authService: AuthService,
    private readonly notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.frmLogin = this.formBuilder.group({
      rol: ['', [Validators.required]],
    });

    this.loadSelects();
  }

  loadSelects(): void {
    const userInfo = this.userStorageService.getInfoSelectProject();
    this.proyecto = userInfo.proyectos[0];
    this.roles = userInfo.proyectos[0].roles;
  }

  getToken(): void {
    const { rol } = this.frmLogin.value;

    const sessionToken: ISessionToken = <ISessionToken>{
      proyecto: this.proyecto._id,
      rol,
    };

    const roleSelected = this.roles.find((r) => r._id === rol);

    sessionToken.usuario =
      this.userStorageService.getInfoSelectProject()?.usuario._id!;
    this.authService.loginWithToken(sessionToken).subscribe({
      next: (response: any) => {
        if (response.success) {
          const selectProject: ISelectProjectDto = {
            rol: roleSelected!,
            _id: this.proyecto._id,
            pais: this.proyecto.pais,
            codigo: this.proyecto.codigo,
            proceso: this.proyecto.proceso,
            subproceso: this.proyecto.subproceso,
          };

          this.userStorageService.saveInfo(
            response.data.token,
            response.data.refreshToken,
            selectProject,
            response.data.path
          );
        } else this.notifierService.warning(response.message);
      },
      error: (error) => this.notifierService.error(error.error.message),
    });
  }
}
