import { FormGroup } from "@angular/forms";
import { IKeyValue, IsKeyValueSwitch } from "src/app/shared/helpers/interfaces/key-value.interface";

export interface CatalogViewClustersAPI extends CatalogViewAPI {
    minimumLifeValue: number;
    maximumLifeValue: number;
    minimumAPLifeValue: number;
    maximumAPLifeValue: number;
    medicalIndicator: string;
}

export interface CatalogViewAPI {
    id: string;
    description: string;
    edit: string;
    delete?: string;
    area?: string;
    areaDescription?: string;
    value?: number;
    codProducto?: number;
    codAmparo?: number | number[];
    codRi?: string;
    codPlan?: string;
    orden?: number;
  }

export interface ProtectionResponseAPI {
    protectionCode:        number;
    protectionDescription: string;
  }

export interface GroupProductAPI {
    productCode: number;
    protections: ProtectionResponseAPI[];
  }

export interface CatalogAPI {
    _id?: string;
    activo?: boolean,
    catalogo?: number,
    clave: number,
    descripcion: string,
    valorMinimoVida?: number;
    valorMaximoVida?: number;
    valorMinimoAPVida?: number;
    valorMaximoAPVida?: number;
    indicadorMedico?: string;
    area?: string;
    claveCadena?: string;
    codProducto?:number;
    codPlan?:string;
    anexoAExcluir?:number;
    codPaquete?:string;
    paquetePrincEstado?:string;
    codAmparo?:string | number[];
    porDefecto?:string;
    edadEstado?:string;
    edad?:number;
    fecha?:string;
    usuario?:string;
    canal?: string;
    codCanal?: string;
    value?: any;
    groupGSPProducts?: GroupProductAPI[];
    groupRIProducts?: GroupProductAPI[];
    cumulusValue?: number;
    isBasic?: boolean;
    codRi?:number;
    idEstado?: string;
    orden?: number;
  }

export const ApiCatalogosCumulos =
[
    {
        // "id": "RN-01",
        "description": "Los montos del expediente superaron",
        "edit": "",
        "minimumLifeValue": 990000001,
        "maximumLifeValue": 1400000000,
        "minimumAPLifeValue": 1200000001,
        "maximumAPLifeValue": 1400000000,
        "medicalIndicator": "Médico"
    }
]


export const listCumulosAPI = 
[
    {
        "longitudCuentaCorriente": [],
        "longitudCuentaAhorro": [],
        "profileAllowedPrioritize": [],
        "profileAllowedInbox": [],
        "perfiles": [],
        "list": [],
        "codAmparo": [],
        "_id": "65523cea847dae2efcf380db",
        "activo": true,
        "catalogo": 15,
        "clave": "RN-01",
        "descripcion": "Los montos del expediente superaron los valores bases",
        "valorMinimoVida": 990000001,
        "valorMaximoVida": 1400000000,
        "valorMinimoAPVida": 1200000001,
        "valorMaximoAPVida": 1400000000,
        "indicadorMedico": "Médico",
        "perfil": 27
    }
]

export interface FormConfigAPI {
    type: FormConfigTypeAPI,
    label: string;
    formControlName: string;
    placeHolder?: string;
    values?: IsKeyValueSwitch[];
  }

export enum FormConfigTypeAPI {
    INPUT,
    SELECT,
    TEXAREA,
    SELECT_WITHVIEW,
    TOPPING,
    AUTOCOMPLETE,
    AUTOCOMPLETE_EXCLUSION,
}

export interface IRequestExclusionAPI {
    _id?: string;
    accion?: string;
    codPaquete?: string;
    codPlan?: string;
    codProduct?: number;
    comentario?: string;
    descExclusion?: string;
    excFecha?: Date;
    exclusionAP?: string;
    exclusionDeporte?: string;
    exclusionVida?: string;
    excUsuario?: string;
    idSolicitud?: number;
    nroCotiza?: number;
    observacion?: string;
    rol?: string;
    typeGeneratedFrom?: number;
  }

  export interface IAmparoAPI {
    _id?: string;
    calculoExtraprima?: string;
    codAmparo: number;
    codAmparoRI: number;
    codPlan: string;
    codProduct: number;
    comentario?: string;
    extraprimable: string;
    factorExtraPriGSP: number;
    factorExtraPriSug: number;
    identificacionAseg: number;
    nroCotizacion: number;
    observacion?: string;
    porcExtraPriGSP: number;
    porcExtraPriSug: number;
    primaAnualPesos: number;
    primaAnualUnidad: number;
    valAsegPesos: number;
    valAsegUnidad: number;
    valorExtraprimaPesos: number;
  }
  
export interface ModalConfigDataAPI {
    arrive: string | null,
    title: string;
    info: string;
    form: {
      group: FormGroup,
      config: FormConfigAPI[],
    };
    buttonOkName: string;
    buttonCancelName: string;
    exclusionsPortal?: IRequestExclusionAPI[];
    extraPrimasList?: IAmparoAPI[];
    msgError?:string;
    tablesForAccumulations?: GroupAPI[];
}
  
  export interface GroupAPI {
    groupCode: string;
    groupProducts: GroupProductAPI[];
  }

  export const MEDICAL_INDICATOR_DATA_API: IKeyValue[] = [
    { key: 'Médico', value: 'Médico' },
    { key: 'No Médico', value: 'No Médico' },
  ]

  export const formConfigAPI: FormConfigAPI[] = [
    {
      type: FormConfigTypeAPI.INPUT,
      label: 'Descripcion',
      formControlName: 'description',
    },
    {
      type: FormConfigTypeAPI.INPUT,
      label: 'Cumulo producto',
      formControlName: 'minimumLifeValue',
    },
    {
      type: FormConfigTypeAPI.INPUT,
      label: 'Cumulo reaseguro',
      formControlName: 'maximumLifeValue',
    },
    {
      type: FormConfigTypeAPI.SELECT,
      label: 'Cumulo reaseguro',
      formControlName: 'maximumLifeValue',
    },
  ];

