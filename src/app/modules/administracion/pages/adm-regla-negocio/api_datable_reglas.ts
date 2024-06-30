////////////////////////////// VARIABLES Y ENUM /////////////////////
export const statusListData = [
  {
    value: 'ALL',
    label: 'Todas',
  },
  {
    value: 'ACTIVE',
    label: 'Activas',
  },
  {
    value: 'INACTIVE',
    label: 'Inactivas',
  },
];

export const tipoRuleListData = [
{
  value:0,
  label:"Todas",
},
{
  value:1,
  label:"Operaciones",
},
{
  value:2,
  label:"Técnico",
},
{
  value:3,
  label:"Reaseguro",
},
{
  value:4,
  label:"Médico",
},
{
  value:5,
  label:"Complianse",
},
]


export const tipoProductListData = [
  {
    value: 0,
    label: 'Hipotecario',
}
]

export const tipoRuleOcupacionListData = [
  {
    value: 0,
    label: 'Todas',
  },
  {
    value: 1,
    label: 'Ocupación',
  },
];

export const tipoRuleExamenMedicoListData = [
  {
    value: 0,
    label: 'Todas',
  },
  {
    value: 1,
    label: 'Online',
  },
];

export const listOfRules = {
  // case 1:
  //   return 'Cumulos';
  // case 2:
  //   return 'IMC';
  // case 3:
  //   return 'Tarifas';
  // case 4:
  //   return "Cumplimiento";
  // case 10:
  //   return "Ocupación";
  // case 11:
  //   return "Examen Médico - Presencial";
  // case 12:
  //   return "Nacionalidad";
  // case 13:
  //   return "Examen Médico - Online";
  
  // case 14:
  //   return "QeQ";

  // case 15:
  //   return "OII";
}

/////////////////////////////// API ////////////////////////////////
export var ulesStateACTIVE = 
[
          {
              "_id": "661e754a0f62936d39c67448",
              "number": "RN-01",
              "message": "Todas",
              "severity": 2,
              "type": 1,
              "disabled": false,
          },
          {
              "_id": "661e754a0f62936d39c67449",
              "number": "RN-02",
              "type": 2,
              "severity": 2,
              "message": "Todas",
              "disabled": false,
              "schemaCatalogs": []
          },
          {
              "_id": "661e754a0f62936d39c6744a",
              "number": "RN-03",
              "type": 3,
              "severity": 1,
              "message": "Todas",
          },
          {
              "_id": "661e754a0f62936d39c6744b",
              "number": "RN-04",
              "type": 10,
              "severity": 2,
              "message": "Todas",
              "disabled": false,
              "schemaCatalogs": []
          },
          {
              "_id": "661e754a0f62936d39c6744c",
              "number": "RN-05",
              "type": 11,
              "severity": 2,
              "message": "Todas",
              "disabled": false,
              "schemaCatalogs": []
          },
          {
            "_id": "661e754a0f62936d39c6744c",
            "number": "RN-06",
            "type": 13,
            "severity": 2,
            "message": "Todas",
            "disabled": false,
            "schemaCatalogs": []
          },
          {
              "_id": "661e754a0f62936d39c6744d",
              "number": "RN-07",
              "type": 12,
              "severity": 2,
              "message": "Todas",
              "disabled": false,
              "schemaCatalogs": []
          },
          {
            "_id": "661e754a0f62936d39c6744d",
            "number": "RN-09",
            "type": 14,
            "severity": 2,
            "message": "Todas",
            "disabled": false,
            "schemaCatalogs": []
          },
          {
            "_id": "661e754a0f62936d39c6744d",
            "number": "RN-10",
            "type": 15,
            "severity": 2,
            "message": "Todas",
            "disabled": false,
            "schemaCatalogs": []
          },
        //   {
        //     "_id": "661e754a0f62936d39c6744d",
        //     "number": "RN-10",
        //     "type": 16,
        //     "severity": 2,
        //     "message": "Todas",
        //     "disabled": false,
        //     "schemaCatalogs": []
        // }
]