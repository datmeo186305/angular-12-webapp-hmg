# Monex webApp

## Requirement
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.2.

Node v12

## Guide

Auto migrate effect

- ng generate @ngrx/schematics:create-effect-migration

### Install openapi-generator-cli dependency

```
yarn global add @openapitools/openapi-generator-cli
```


### Generate api docs

```
yarn generate
```

### Install dependencies

```
yarn install
```

### Run development

```
yarn start                              //develop

yarn start --configuration development   //develop

yarn start --configuration staging      //staging
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Note
Reference https://github.com/OpenAPITools/openapi-generator/issues/10182
- Version 5.2.1 is error while generating. use 5.2.0
```
{
  "$schema": "node_modules/@openapitools/openapi-generator-cli/config.schema.json",
  "spaces": 2,
  "generator-cli": {
    "version": "5.2.0"
  }
}
```
