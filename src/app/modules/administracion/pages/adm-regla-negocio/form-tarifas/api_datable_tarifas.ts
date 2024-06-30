////////////////////////////// VARIABLES Y ENUM /////////////////////


/////////////////////////////// API ////////////////////////////////
export interface CatalogViewClustersAPI{
    _id:string;
    fallecimiento: number;
    invalidez: number;
    desempleo: number;
    total: number;
}//use datable list

export const dataListTarifaAPI = 
[
    {
        "_id": "661e754a0f62936d39c67448",
        "fallecimiento": 0.292,
        "invalidez": 0.014,
        "desempleo": 0.36,
        "total": 0.7,
    },
    {
        "_id": "661e754a0f62936d39c67449",
        "fallecimiento": 0.234,
        "invalidez": 0.0211,
        "desempleo": 0.369,
        "total": 0.3
    }
]

export const dataEditApi = 
{
    "nTarifas": "4",
    "tarifaTitular": "123",
    "tarifa1": "12",
    "tarifa2": "23",
    "tarifa3": "132",
    "tarifa4": "4",
    "total": "5"
}