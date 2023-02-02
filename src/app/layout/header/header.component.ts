import { ERROR_CODE_KEY } from './../../core/common/enum/payday-loan';
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { NotificationService } from 'src/app/core/services/notification.service';
import { SignOnControllerService } from './../../../../open-api-modules/identity-api-docs/api/signOnController.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../core/store';
import * as fromActions from '../../core/store';
import { Router } from '@angular/router';
import * as fromSelectors from '../../core/store/selectors';
import { Observable } from 'rxjs/Observable';
import { CustomerInfoResponse } from '../../../../open-api-modules/customer-api-docs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  customerInfo$: Observable<CustomerInfoResponse>;
  showStepProgressBar$: Observable<boolean>;
  showStepNavigation$: Observable<boolean>;
  showProfileBtn$: Observable<boolean>;
  showLeftBtn$: Observable<boolean>;
  showRightBtn$: Observable<boolean>;
  navigationTitle$: Observable<string>;
  showNavigationBar$: Observable<boolean>;
  authorization$: Observable<any>;

  customerInfo: CustomerInfoResponse = null;
  logoSrc: string = 'assets/img/logo/payday-loan-light.svg';
  isLogged: boolean = true;
  isSignUp: boolean = false;
  showStepProgressBar: boolean = false;
  showStepNavigation: boolean = false;
  displayLeftBtn: boolean = true;
  displayRightBtn: boolean = true;
  showProfileBtn: boolean = false;
  showNavigationBar: boolean = true;
  leftBtnIcon: string = 'sprite-group-3-icon-back';
  rightBtnIcon: string = 'sprite-group-3-help-white';
  titleNavigation: string = 'Ứng lương 0% lãi';
  shortName: string = '0';

  subManager = new Subscription();

  constructor(
    private router: Router,
    private store: Store<fromStore.State>,
    private signOnControllerService: SignOnControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService
  ) {
    this._subscribeHeaderInfo();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  private _subscribeHeaderInfo() {
    this.customerInfo$ = this.store.select(fromSelectors.getCustomerInfoState);
    this.showStepProgressBar$ = this.store.select(
      fromSelectors.displayStepProgressBar
    );
    this.showStepNavigation$ = this.store.select(
      fromSelectors.displayStepNavigation
    );
    this.showProfileBtn$ = this.store.select(fromSelectors.displayProfileBtn);
    this.showLeftBtn$ = this.store.select(fromSelectors.displayLeftBtn);
    this.showRightBtn$ = this.store.select(fromSelectors.displayRightBtn);
    this.showNavigationBar$ = this.store.select(
      fromSelectors.displayNavigationBar
    );
    this.navigationTitle$ = this.store.select(fromSelectors.getNavigationTitle);
    this.authorization$ = this.store.select(
      fromSelectors.getAuthorizationState
    );

    this.subManager.add(
      this.customerInfo$.subscribe((customerInfo: CustomerInfoResponse) => {
        this.customerInfo = customerInfo;
        if (customerInfo?.personalData?.firstName) {
          const names = customerInfo.personalData.firstName.split(' ');
          this.shortName = names[names.length - 1].charAt(0);
        } else {
          this.shortName = '0';
        }
      })
    );

    this.subManager.add(
      this.showStepProgressBar$.subscribe((show: boolean) => {
        this.showStepProgressBar = show;
      })
    );

    this.subManager.add(
      this.showStepNavigation$.subscribe((show: boolean) => {
        this.showStepNavigation = show;
      })
    );

    this.subManager.add(
      this.authorization$.subscribe((authorization: any) => {
        this.showProfileBtn = !!authorization;
      })
    );

    this.subManager.add(
      this.showLeftBtn$.subscribe((show: boolean) => {
        this.displayLeftBtn = show;
      })
    );

    this.subManager.add(
      this.showRightBtn$.subscribe((show: boolean) => {
        this.displayRightBtn = show;
      })
    );

    this.subManager.add(
      this.showNavigationBar$.subscribe((show: boolean) => {
        this.showNavigationBar = show;
      })
    );

    this.subManager.add(
      this.navigationTitle$.subscribe((navigationTitle: string) => {
        this.titleNavigation = navigationTitle;
      })
    );
  }

  backToPrevPage() {
    this.store.dispatch(new fromActions.ClickBackBtn());
  }

  logout() {
    this.signOnControllerService.signOut().subscribe((result) => {
      if (!result || result.responseCode !== 200) {
        return this.handleResponseError(result.errorCode);
      }
      this.store.dispatch(new fromActions.Logout(null));
    });
    this.router.navigateByUrl('/');
  }

  handleResponseError(errorCode: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant('common.error'),
      content: this.multiLanguageService.instant(
        errorCode && ERROR_CODE_KEY[errorCode]
          ? ERROR_CODE_KEY[errorCode]
          : 'common.something_went_wrong'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }
}
