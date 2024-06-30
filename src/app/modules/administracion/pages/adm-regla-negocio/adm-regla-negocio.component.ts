import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import {
  statusListData,
  tipoRuleListData,
  tipoRuleExamenMedicoListData,
  ulesStateACTIVE,
  tipoProductListData,
} from "./api_datable_reglas";
import { Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MdlDisabledComponent } from "./mdl-disabled/mdl-disabled.component";

@Component({
  selector: "app-adm-regla-negocio",
  templateUrl: "./adm-regla-negocio.component.html",
  styleUrls: ["./adm-regla-negocio.component.scss"],
})
export class AdmReglaNegocioComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  breadcrumbs = ["BRMS", "Reglas"];
  displayedColumns = ["message", "type", "status", "actions"];
  pageSizeOptions: Array<number> = [];
  isLoadingResults = true;
  statusList = statusListData;
  tipoRuleList = tipoRuleListData;
  tipoProduct = tipoProductListData;
  tipoRuleExamenMedicoListData = tipoRuleExamenMedicoListData
  dataSource: any[] = [];

  totalRulesCount = 0;

  private destroy$ = new Subject<void>();

  statusSelected = new FormControl<string>("ACTIVE");
  ruleTypeSelected = new FormControl<number>(0);
  productoSelected = new FormControl<number>(0);

  constructor(private router: Router, public dialog: MatDialog) {
    this.pageSizeOptions = [10, 25, 50, 100];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRuleTye(ruleType: any): string {
    switch (ruleType) {
      case 1:
        return 'Cumulos';
      case 2:
        return 'IMC';
      case 3:
        return 'Tarifas';
      case 4:
        return "Cumplimiento";
      case 10:
        return "Ocupación";
      case 11:
        return "Examen Médico - Presencial";
      case 12:
        return "Nacionalidad";
      case 13:
        return "Examen Médico - Online";
      
      case 14:
        return "QeQ";

      case 15:
        return "OII";

      // case 16:
      //   return "Cumulos";

      default:
        return "";
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isLoadingResults = false;
      this.dataSource = ulesStateACTIVE;
    }, 500);
  }

  goToEditRules(ruleNumber: string, type:number): void {
    if(type == 1){
      this.router.navigateByUrl(
        `/administracion/regla-negocios/editar/${ruleNumber}`
      );
    }

    if(type == 2){
      this.router.navigateByUrl(
        `/administracion/imc/editar/${ruleNumber}`
      );
    }

    if(type == 3){
      this.router.navigateByUrl(
        `/administracion/tarifas/editar/${ruleNumber}`
      );
    }
      
    if(type == 10){
      this.router.navigateByUrl(
        `/administracion/regla-negocios/ocupacion`
      );
    }
    
    if(type == 11){
      this.router.navigateByUrl(
        `/administracion/regla-negocios/examen-medico`
      );
    }
    
    if(type == 12){
      this.router.navigateByUrl(
        `/administracion/regla-negocios/nacionalidad`
      );
    }

    if(type == 14){
      this.router.navigateByUrl(
        `/administracion/regla-negocios/catalogos/carga-masiva-qeq`
      );
    }

    if(type == 15){
      this.router.navigateByUrl(
        `/administracion/regla-negocios/catalogos/carga-masiva-oii`
      );
    }

    if(type == 16){
      this.router.navigateByUrl(
        `/administracion/regla-negocios/catalogos/carga-masiva-cumulos`
      );
    }
  }

  disableRule(ruleNumber: string, disable: boolean) {
    const dialogRef = this.dialog.open(MdlDisabledComponent, {
      data: { ruleNumber, disable },
    });
  } //Debe redirigir al desabilitar
}
