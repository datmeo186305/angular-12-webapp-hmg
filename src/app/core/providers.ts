import {CookieService} from 'ngx-cookie-service';
import {MultiLanguageService} from '../share/translate/multiLanguageService';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import * as fromInterceptors from "./interceptors";
import {APP_INITIALIZER, Injector} from "@angular/core";
import {appInitializerFactory} from "../share/translate/appInitializerFactory";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {DEFAULT_TIMEOUT} from './interceptors';
import {environment} from '../../environments/environment';

export const _providers = [
  CookieService,
  MultiLanguageService,
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [MultiLanguageService, Injector],
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: fromInterceptors.ApiHttpInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: fromInterceptors.TimingInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: fromInterceptors.LoadingInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: fromInterceptors.TimeoutInterceptor,
    multi: true,
  },
  {provide: MAT_DATE_LOCALE, useValue: 'vi-VN'},
  {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE],
  },
  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  {provide: DEFAULT_TIMEOUT, useValue: environment.DEFAULT_TIMEOUT},
]

