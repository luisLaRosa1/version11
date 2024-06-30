import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IResponse, IResponseV2 } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { CustomizerSettingsService } from 'src/app/shared/services/layout/customizer-settings.service';
import { ToggleService } from 'src/app/shared/services/layout/toggle.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { sidebarData } from './api_side_bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  userInfo!: IUserStorageUserDto;
  sidebar!: ISideBarV2;
  initialPath: string = '/busquedas';

  panelOpenState = false;
  isToggled = false;

  constructor(
    private router: Router,
    private toggleService: ToggleService,
    private userStorageService: UserStorageService,
    public themeService: CustomizerSettingsService
  ) {
    this.userInfo = this.userStorageService.getCurrentUserInfo();

    this.toggleService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  ngOnInit(): void {
    this.toggleService.getMenu().subscribe((response: IResponseV2<ISideBarV2>) => {
      response.data.menu.forEach((menu: IMenuV2) => {
        menu.opcion?.forEach((opcions) => {
          opcions.url = menu.url+opcions.url
        });
      });
      this.sidebar = (response.data);
    });
  }

  toggle(): void {
    this.toggleService.toggle();
  }

  toggleSidebarTheme(): void {
    this.themeService.toggleSidebarTheme();
  }

  toggleHideSidebarTheme(): void {
    this.themeService.toggleHideSidebarTheme();
  }
}

export interface ISideBarV2 {
  pathInicial: string;
  rol: string;
  menu: IMenuV2[];
}

export interface IMenuV2 {
  url: string;
  expanded: boolean;
  descripcion: number;
  icono: string;
  opcion: IOpcion[];
}

export interface IOpcion {
  url: string;
  descripcion: number;
  expanded: boolean;
  icono: string;
}

export interface ISideBar {
  pathInicial: string;
  modulos: IModulo[];
}

export interface IModulo {
  descripcion: string;
  orden: number;
  menus: IMenu[];
}

export interface IMenu {
  descripcion: string;
  path: string;
  icono: string;
  orden: number;
  expanded: boolean;
  submenus: ISubmenu[];
}

export interface ISubmenu {
  descripcion: string;
  path: string;
  orden: number;
}
