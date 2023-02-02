import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

// Reference: https://www.concretepage.com/angular-2/angular-custom-preloading-strategy

@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      console.log(
        'Preload Path: ' + route.path + ', delay:' + route.data['delay']
      );

      this.preloadedModules.push(route.path);

      if (route.data['delay']) {
        return timer(5000).pipe(mergeMap(() => load()));
      }

      return load();
    } else {
      return of(null);
    }
  }
}
