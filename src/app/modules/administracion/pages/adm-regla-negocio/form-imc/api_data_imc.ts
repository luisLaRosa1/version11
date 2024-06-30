import { FormGroup } from "@angular/forms";
import { IKeyValue, IsKeyValueSwitch } from "src/app/shared/helpers/interfaces/key-value.interface";

export interface CatalogViewClustersAPI{
    valorBase1: string;
    comparacion1: string;
    valorBase2: number;
    comparacion2: string;
}//use datable list



// export interface CatalogAPI {
//     _id?: string;
//     valorBase1Value: string,
//     comparacion2Value?: number;
//     valorMaximoVida?: number;
//     valorMaximoAPVida?: number;
//   }



export const listCumulosAPI = 
[
    {
        "valorBase1Value": "16.2",
        "comparacion1Value": ">=",
        "comparacion2Value": "<=",
        "valorMaximoVida": 20.4,
        "valorMaximoAPVida": 20.4,
    }
]

export interface FormConfigAPI {
    type: FormConfigTypeAPI,
    label: string;
    formControlName: string;
    placeHolder?: string;
    values?: IsKeyValueSwitch[];
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
    msgError?:string;
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

  export const formConfigAPI: FormConfigAPI[] = [
    // {
    //   type: FormConfigTypeAPI.INPUT,
    //   label: 'Valor  base 1:',
    //   formControlName: 'valorBase1Fcn',
    // },
    // {
    //   type: FormConfigTypeAPI.INPUT,
    //   label: 'Comparación',
    //   formControlName: 'comparacionFcn',
    // },
    // {
    //   type: FormConfigTypeAPI.INPUT,
    //   label: 'Valor base 2:',
    //   formControlName: 'valorBase2Fcn',
    // },

    {
      type: FormConfigTypeAPI.TEXAREA,
      label: 'Valor  base 1:',
      formControlName: 'valorBase1Fcn',
    },
    {
      type: FormConfigTypeAPI.TEXAREA,
      label: 'Valor  base 1:',
      formControlName: 'valorBase1Fcn',
    },
    {
      type: FormConfigTypeAPI.SELECT_WITHVIEW,
      label: 'Check de examen medico',
      formControlName: 'valorBase1Fcn',
    },
    {
      type: FormConfigTypeAPI.SELECT,
      label: 'Área:',
      formControlName: 'modalImcFcn',
    }
  ];//name show in the modal
