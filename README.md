<p align="center">
  <a href="https://www.teggium.com" target="blank"><img width="200" src="https://uatprestozurich.teggium.com/assets/images/logos/logo-teggium-dark.svg"  alt="Teggium_logo" /></a>
</p>

<h2 align="center">Teggium | Aplicación Web Zurich</h2>

## 🛠️ Instaladores

Herramientas requeridas para el desarrollo.

| Nombre                                                            | Command |
| :---------------------------------------------------------------- | :------ |
| [Visual Studio Code](https://code.visualstudio.com/)              | -       |
| [Node.js](https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi) | -       |
| [Git](https://git-scm.com/download/win)                           | \_      |
| [Postman](https://dl.pstmn.io/download/latest/win64)              | -       |

## 📄 Extensiones y configuraciones

Se detalla algunas extensiones y/o configuraciones que nos permitirá mejorar la productividad y calidad de nuestro código:

| Extensión                                                                                                | Extension Id                          |
| :------------------------------------------------------------------------------------------------------- | :------------------------------------ |
| [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)                   | `usernamehw.errorlens`                |
| [Image preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview) | `kisstkondoros.vscode-gutter-preview` |
| [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)                | `wix.vscode-import-cost`              |
| [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)                   | `esbenp.prettier-vscode`              |
| [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)        | `wayou.vscode-todo-highlight`         |
| [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)                   | `Gruntfuggly.todo-tree`               |
| [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)            | `SonarSource.sonarlint-vscode`        |
| [Turbo Console Log](https://marketplace.visualstudio.com/items?itemName=ChakrounAnas.turbo-console-log)  | `ChakrounAnas.turbo-console-log`      |
| [Peacock](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock)                   | `johnpapa.vscode-peacock`             |

En el `settings.json` de su **VS Code** agregar la siguiente configuración:

```bash
 "omnisharp.organizeImportsOnFormat": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit"
  },
  "typescript.updateImportsOnFileMove.enabled": "always",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "editor.fontLigatures": true, #Opcional
  "editor.guides.bracketPairs": true, #Opcional
  "editor.guides.bracketPairsHorizontal": true #Opcional
```

## 🛠️ Iniciar aplicación (Development)

Se requiere tener en ejecución los siguientes proyectos:

| Aplicación                                       | Url                                 |
| :----------------------------------------------- | :---------------------------------- |
| [Api Gateway](http://localhost:2052/api/swagger) | `http://localhost:2052/api/swagger` |
| [Portal Asegurado](http://localhost:2054)        | `http://localhost:2054`             |

Para iniciar la aplicación se necesita ejecutar alguno de estos comandos:

```bash
npm start

ng serve --port 2053 -o
```

## 🛠️ Despliegue

Obtener el compilado del aplicativo para publicar en otro ambiente:

| Ambiente | Comando              |
| :------- | :------------------- |
| DEV      | `npm run deploy_dev` |
| QA       | `npm run deploy_qa`  |
| PROD     | `npm run deploy_pro` |
