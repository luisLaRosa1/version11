import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthActivateAccountComponent } from './pages/auth-activate-account/auth-activate-account.component';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { AuthRecoverPasswordComponent } from './pages/auth-recover-password/auth-recover-password.component';
import { AuthSelectProjectComponent } from './pages/auth-select-project/auth-select-project.component';

const routes: Routes = [
  { path: 'login', title: 'Iniciar sesión', component: AuthLoginComponent },
  {
    path: 'select-project',
    title: 'Selección de perfil',
    component: AuthSelectProjectComponent,
  },
  {
    path: 'activate-account/:id',
    title: 'Activación de cuenta',
    component: AuthActivateAccountComponent,
  },
  {
    path: 'recover-password',
    title: 'Recuperar contraseña',
    component: AuthRecoverPasswordComponent,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
