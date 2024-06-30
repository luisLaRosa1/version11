import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { InfoUserState } from "../states/info-user.state.service";
import { IResponseV2 } from "../../helpers/interfaces/response";
import { ISideBarV2 } from "../../views/layouts/private-layout/sidebar/sidebar.component";

@Injectable({
  providedIn: "root",
})
export class ToggleService {
  public pathAdministracion = `${environment.urlApi}/administracion`;
  public pathAdministracionZurich = `${environment.urlApiZurich}/AdmMenu`;
  private isToggled = new BehaviorSubject<boolean>(false);
  // userInfo!:IUserStorageUserDto;

  constructor(
    private http: HttpClient,
    private _infoUserState: InfoUserState
  ) {}

  get isToggled$() {
    return this.isToggled.asObservable();
  }

  toggle() {
    this.isToggled.next(!this.isToggled.value);
  }

  getMenu(): Observable<IResponseV2<ISideBarV2>> {
    return this.http
      .get(`${this.pathAdministracionZurich}/menu`)
      .pipe(
        tap((result: any) =>
          this._infoUserState.setInfoUser({
            _id: result.data._id,
            perfil: result.data.perfil,
            proyecto: result.data.proyecto,
          })
        )
      );
  }

  checkPermiso(permiso: string) {
    return this.http.get(
      `${this.pathAdministracion}/permiso-perfil/find-permiso-by-perfil/${permiso}`
    );
  }
}
