import { ELanguage } from './helpers/enums/language.enum';

export const AppConsts = {
  APP: {
    Title: `Zurich | {title}`,
    Cliente: 'Zurich',
    Language: ELanguage.SPANISH,
    Copyright: `Presto powered by Teggium | All rights reserved | © ${new Date().getFullYear()} Teggium`,
  },
  SETTINGS: {
    COMPONENTS: {
      TABLE: {
        Limit: 10,
        ItemsPorPage: [10, 25, 50, 100],
      },
    },
    FORMATS: {
      Date: 'DD-MM-YYYY',
      Datetime: 'DD-MM-YYYY HH:mm:ss',
    },
    PATTERNS: {
      Alphanumeric: /^[a-zA-Z0-9 áéíóúñÁÉÍÓÚÑ.,]+$/,
      EmailAddress: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|org|net|edu|gov|global|mx)$/,
      OnlyLetters: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ]+$/,
      OnlyLettersWithSpaces: /^[a-zA-Z áÁéÉíÍóÓúÚñÑ]+$/,
      OnlyNumbers: /^[0-9]$/,
    },
    FILES: {
      EXTENSIONS: {
        General: '.png;.pdf;.tif;.tiff;.jpg;.jpeg;.xlsx',
        ConfirmacionEntrega: '.png;.pdf;.tif;.tiff;.jpg;.jpeg;.xlsx;.msg;.eml',
        FolioLayout: '.xls;.xlsx',
        FormatoKyc: '.png;.pdf;.jpg;.jpeg;.docx;.xls;.xlsx',
      },
    },
    VALIDATIONS: {
      LENGTH: {
        Comentario: 500,
      },
    },
    MESSAGES: {
      TITLE: {
        Error: 'Error',
        Info: 'Información',
        Success: 'Éxito',
        Warning: 'Advertencia',
      },
    },
  },




  
  ZURICH_TABLE_FORMAT:{
    settings: {
      language: ELanguage.SPANISH,
    },
    pagination: {
      limit: 5,
      search: '',
      table: {
        itemsPorPage: [10, 25, 50, 100],
        itemsPorPageCustom: [5],
      },
    },
  }
};
