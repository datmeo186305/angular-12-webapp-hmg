import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
// import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../core/store';
import * as fromStore from '../../../core/store';
import { Observable } from 'rxjs';
import * as fromSelectors from '../../../core/store/selectors';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-up-success',
  templateUrl: './sign-up-success.component.html',
  styleUrls: ['./sign-up-success.component.scss'],
})
export class SignUpSuccessComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private customerMobile$: Observable<string>;

  customerMobile: string = '';

  get signUpSuccessBodyText(): string {
    return `Chúc mừng số điện thoại <span class='pl-text-sent-confirm-policy-inline'>${
      this.customerMobile || ''
    }</span> đã tạo tài khoản thành công. Đăng nhập để sử dụng dịch vụ`;
  }
  countdownTime: number = environment.REDIRECT_TO_SIGN_IN_COUNTDOWN_TIME;
  intervalTime: any;

  constructor(
    private router: Router,
    //private titleService: Title,
    private store: Store<fromStore.State>
  ) {
    this.customerMobile$ = store.select(fromSelectors.getCustomerMobileState);
    this.customerMobile$.subscribe((customerMobile) => {
      this.customerMobile = customerMobile;
    });
  }

  ngOnInit(): void {
    // this.titleService.setTitle(
    //   'Đăng ký thành công' + ' - ' + environment.PROJECT_NAME
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
      document.getElementById('sign-up-success-countdown-timer').textContent =
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
