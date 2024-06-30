import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShareNotFoundComponent } from './shared/views/components/share-not-found/share-not-found.component';
import { PrivateLayoutComponent } from './shared/views/layouts/private-layout/private-layout.component';
import { PublicLayoutComponent } from './shared/views/layouts/public-layout/public-layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'authentication/login', pathMatch: 'full' },
  {
    path: 'authentication',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../app/modules/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: 'administracion',
    component: PrivateLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../app/modules/administracion/administracion.module').then(
            (m) => m.AdministracionModule
          ),
      },
    ],
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../app/modules/kyc/kyc.module').then((m) => m.KycModule),
      },
    ],
  },
  { path: '**', component: ShareNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
