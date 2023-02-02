import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
// import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../core/store';
import * as fromStore from '../../../core/store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password-success',
  templateUrl: './reset-password-success.component.html',
  styleUrls: ['./reset-password-success.component.scss'],
})
export class ResetPasswordSuccessComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  countdownTime: number = environment.REDIRECT_TO_SIGN_IN_COUNTDOWN_TIME;
  intervalTime: any;

  constructor(
    private router: Router,
    //private titleService: Title,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {
    // this.titleService.setTitle(
    //   'Quên mật khẩu thành công' + ' - ' + environment.PROJECT_NAME
    // );
    this.initHeaderInfo();
    this.resetSession();
    this.countdownTimer(this.countdownTime);
  }

  ngAfterViewInit(): void {}

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowNavigationBar(false));
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }

  btnClick() {
    this.redirectToSignInPage();
  }

  redirectToSignInPage() {
    this.router.navigateByUrl('/auth/sign-in').then((r) => {});
  }

  countdownTimer(second) {
    let duration = moment.duration(second * 1000, 'milliseconds');
    let interval = 1000;
    let intervalProcess = (this.intervalTime = setInterval(() => {
      duration = moment.duration(
        duration.asMilliseconds() - interval,
        'milliseconds'
      );
      document.getElementById('forgot-pass-countdown-time').textContent =
        '( ' + duration.asSeconds() + 's )';
      if (duration.asSeconds() == 0) {
        clearInterval(intervalProcess);
        this.redirectToSignInPage();
      }
    }, interval));
  }

  destroyCountdownTimer() {
    clearInterval(this.intervalTime);
  }

  ngOnDestroy(): void {
    this.destroyCountdownTimer();
  }
}
