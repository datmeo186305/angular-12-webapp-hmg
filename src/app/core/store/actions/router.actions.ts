import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const GO = '[Router] Go';
export const BACK = '[Router] Back';
export const FORWARD = '[Router] Forward';
export const CLICK_BACK_BTN = '[Router] Click back btn';

export class Go implements Action {
  readonly type = GO;

  constructor(
    public payload: {
      path: any[];
      query?: object;
      extras?: NavigationExtras;
    }
  ) {}
}

export class Back implements Action {
  readonly type = BACK;
}

export class Forward implements Action {
  readonly type = FORWARD;
}

export class ClickBackBtn implements Action {
  readonly type = CLICK_BACK_BTN;
}

export type Actions = Go | Back | Forward | ClickBackBtn;
