import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MultiLanguageService {
  private _subject = new Subject<any>();
  private _translationsUrl = 'assets/i18n';

  constructor(
    private cookieService: CookieService,
    private translateService: TranslateService,
    private http: HttpClient
  ) {}

  public currentLanguage() {
    // const _language = this.cookieService.get('_language');
    const _language = localStorage.getItem('_language');
    return _language ? _language : 'en';
  }

  private _setCurrentLanguage(language: string) {
    // this.cookieService.set( '_language', language , 30, '/');
    localStorage.setItem('_language', language);
  }

  public changeLanguage(language: string) {
    this._setCurrentLanguage(language);
    this._subject.next({ language: language });
  }

  public use(language: string) {
    return this.translateService.use(language);
  }

  public setDefaultLang(language: string) {
    return this.translateService.setDefaultLang(language);
  }

  public reloadLang(language: string) {
    return this.translateService.reloadLang(language);
  }

  public resetLang(language: string) {
    return this.translateService.resetLang(language);
  }

  private _getLanguage(): Observable<any> {
    return this._subject.asObservable();
  }

  public onSetupMultiLanguage(prefixName: string) {
    this._getLanguage().subscribe((value) => {
      const language = value.language;
      this.translateService.use(language).subscribe((value) => {
        this.loadTranslations(language, prefixName);
      });
    });

    this.translateService.use(this.currentLanguage()).subscribe((value) => {
      this.loadTranslations(this.currentLanguage(), prefixName);
    });
  }

  private loadTranslations(locale: string, prefixName: string) {
    let cacheBuster = new Date().toISOString().replace(/\\.|:|-/g, '');
    return this.http
      .get(
        `${this._translationsUrl}/${prefixName}/${locale}.json?cacheBuster=${cacheBuster}`
      )
      .subscribe((data: any) => {
        this.translateService.setTranslation(locale, data, true);
      });
  }

  public get(
    key: string | Array<string>,
    interpolateParams?: Object
  ): Observable<string | any> {
    return this.translateService.get(key, interpolateParams);
  }

  public instant(key: string | Array<string>, interpolateParams?: Object) {
    return this.translateService.instant(key, interpolateParams);
  }
}
