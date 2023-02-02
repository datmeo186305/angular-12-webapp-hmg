import { Injectable } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import * as fromSelectors from "../store/selectors";
import {Store} from "@ngrx/store";
import * as fromStore from "../store";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken$: Observable<string | undefined>;
  private token: string;

  constructor(public jwtHelper: JwtHelperService, private store: Store<fromStore.State> ) {
    this.accessToken$ = store.select(fromSelectors.getTokenState);
    this.accessToken$.subscribe((token) => {
      this.token = token;
    });
  }
  // ...
  public isAuthenticated(): boolean {
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(this.token);
  }
}
