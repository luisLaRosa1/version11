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
    id: number;
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
        "id": 2,
        "description": "Junior",
        "edit": "",
        "minimumLifeValue": 990000001,
        "maximumLifeValue": 1400000000,
        "minimumAPLifeValue": 1200000001,
        "maximumAPLifeValue": 1400000000,
        "medicalIndicator": "Médico"
    },
    {
        "id": 5,
        "description": "Regional",
        "edit": "",
        "minimumLifeValue": 2200000001,
        "maximumLifeValue": 5000000000,
        "minimumAPLifeValue": 2700000001,
        "maximumAPLifeValue": 10000000000,
        "medicalIndicator": "Médico"
    },
    {
        "id": 4,
        "description": "Senior",
        "edit": "",
        "minimumLifeValue": 1700000001,
        "maximumLifeValue": 2200000000,
        "minimumAPLifeValue": 1700000001,
        "maximumAPLifeValue": 2700000000,
        "medicalIndicator": "Médico"
    },
    {
        "id": 1,
        "description": "Speed",
        "edit": "",
        "minimumLifeValue": 0,
        "maximumLifeValue": 990000000,
        "minimumAPLifeValue": 0,
        "maximumAPLifeValue": 1200000000,
        "medicalIndicator": "No Médico"
    },
    {
        "id": 3,
        "description": "Suscriptor/Normal",
        "edit": "",
        "minimumLifeValue": 1400000001,
        "maximumLifeValue": 1700000000,
        "minimumAPLifeValue": 1400000001,
        "maximumAPLifeValue": 1700000000,
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
        "clave": 2,
        "descripcion": "Junior",
        "valorMinimoVida": 990000001,
        "valorMaximoVida": 1400000000,
        "valorMinimoAPVida": 1200000001,
        "valorMaximoAPVida": 1400000000,
        "indicadorMedico": "Médico",
        "perfil": 27
    },
    {
        "longitudCuentaCorriente": [],
        "longitudCuentaAhorro": [],
        "profileAllowedPrioritize": [],
        "profileAllowedInbox": [],
        "perfiles": [],
        "list": [],
        "codAmparo": [],
        "_id": "65523d90847dae2efcf380de",
        "activo": true,
        "catalogo": 15,
        "clave": 5,
        "descripcion": "Regional",
        "valorMinimoVida": 2200000001,
        "valorMaximoVida": 5000000000,
        "valorMinimoAPVida": 2700000001,
        "valorMaximoAPVida": 10000000000,
        "indicadorMedico": "Médico",
        "perfil": 23
    },
    {
        "longitudCuentaCorriente": [],
        "longitudCuentaAhorro": [],
        "profileAllowedPrioritize": [],
        "profileAllowedInbox": [],
        "perfiles": [],
        "list": [],
        "codAmparo": [],
        "_id": "65523d4a847dae2efcf380dd",
        "activo": true,
        "catalogo": 15,
        "clave": 4,
        "descripcion": "Senior",
        "valorMinimoVida": 1700000001,
        "valorMaximoVida": 2200000000,
        "valorMinimoAPVida": 1700000001,
        "valorMaximoAPVida": 2700000000,
        "indicadorMedico": "Médico",
        "perfil": 22
    },
    {
        "longitudCuentaCorriente": [],
        "longitudCuentaAhorro": [],
        "profileAllowedPrioritize": [],
        "profileAllowedInbox": [],
        "perfiles": [],
        "list": [],
        "codAmparo": [],
        "_id": "65523c69847dae2efcf380da",
        "activo": true,
        "catalogo": 15,
        "clave": 1,
        "descripcion": "Speed",
        "valorMinimoVida": 0,
        "valorMaximoVida": 990000000,
        "valorMinimoAPVida": 0,
        "valorMaximoAPVida": 1200000000,
        "indicadorMedico": "No Médico",
        "perfil": 28
    },
    {
        "longitudCuentaCorriente": [],
        "longitudCuentaAhorro": [],
        "profileAllowedPrioritize": [],
        "profileAllowedInbox": [],
        "perfiles": [],
        "list": [],
        "codAmparo": [],
        "_id": "65523d1c847dae2efcf380dc",
        "activo": true,
        "catalogo": 15,
        "clave": 3,
        "descripcion": "Suscriptor/Normal",
        "valorMinimoVida": 1400000001,
        "valorMaximoVida": 1700000000,
        "valorMinimoAPVida": 1400000001,
        "valorMaximoAPVida": 1700000000,
        "indicadorMedico": "Médico",
        "perfil": 26
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
      label: 'Nombre',
      formControlName: 'description',
    },
    {
      type: FormConfigTypeAPI.INPUT,
      label: 'Valor Mínimo Vida',
      formControlName: 'minimumLifeValue',
    },
    {
      type: FormConfigTypeAPI.INPUT,
      label: 'Valor Máximo Vida',
      formControlName: 'maximumLifeValue',
    },
    {
      type: FormConfigTypeAPI.INPUT,
      label: 'Valor Mínimo AP Vida',
      formControlName: 'minimumAPLifeValue',
    },
    {
      type: FormConfigTypeAPI.INPUT,
      label: 'Valor Máximo AP Vida',
      formControlName: 'maximumAPLifeValue',
    },
    {
      type: FormConfigTypeAPI.SELECT,
      label: 'Indicador Médico',
      formControlName: 'medicalIndicator',
      values: MEDICAL_INDICATOR_DATA_API,
    }
  ];

  export const btnAgregarCumulos = {
    "id": 2,
    "description": "Junior",
    "edit": "",
    "minimumLifeValue": 990000001,
    "maximumLifeValue": 1400000000,
    "minimumAPLifeValue": 1200000001,
    "maximumAPLifeValue": 1400000000,
    "medicalIndicator": "Médico",
    "iconName": "fa-solid fa-pen"
}
