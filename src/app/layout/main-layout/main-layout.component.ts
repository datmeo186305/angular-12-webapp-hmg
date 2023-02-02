import { environment } from './../../../environments/environment';
import { Rating } from '../../../../open-api-modules/customer-api-docs';
import { RatingComponent } from '../../pages/payday-loan/components/rating/rating.component';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../core/common/animations/router.animation';
import { MultiLanguageService } from '../../share/translate/multiLanguageService';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CustomerInfoResponse } from 'open-api-modules/customer-api-docs';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  animations: [
    fadeAnimation,
    // animation triggers go here
  ],
})
export class MainLayoutComponent implements OnInit {
  rateInfo$: Observable<any>;
  customerId$: Observable<string>;
  accessToken$: Observable<string>;
  loadingStatus$: Observable<boolean>;
  // coreToken$: Observable<string>;

  customerId: string;
  accessToken: string;
  // coreToken: string;
  public customerInfo$: Observable<any>;
  customerInfo: CustomerInfoResponse;

  maintainStartTime: string = environment.MAINTAINANCE_START_TIME;
  maintainEndTime: string = environment.MAINTAINANCE_END_TIME;

  subManager = new Subscription();
  constructor(
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private router: Router,
    private store$: Store<fromStore.State>
  ) {
    this._initSubscribeState();
    this.checkMaintainTime();
  }

  async ngOnInit() {
    await this.multiLanguageService.changeLanguage('vi');
    await this.multiLanguageService.use('vi');
    await this.initCustomerState();
  }

  initCustomerState() {
    if (this.accessToken) {
      this.store.dispatch(new fromStore.GetCustomerInfo(this.customerId));
      this.customerInfo$ = this.store$.select(fromStore.getCustomerInfoState);
      this.subManager.add(
        this.customerInfo$.subscribe((customerInfo) => {
          this.customerInfo = customerInfo;
          if (
            !this.router.url.includes(
              this.customerInfo.personalData.companyGroupName.toLowerCase()
            )
          ) {
            this.router.navigateByUrl('/companies');
          }
        })
      );
    }
  }

  _initSubscribeState() {
    this.rateInfo$ = this.store.select(fromStore.getRatingState);
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.accessToken$ = this.store.select(fromStore.getTokenState);
    this.loadingStatus$ = this.store.select(fromStore.getLoadingStatus);
    // this.coreToken$ = this.store.select(fromStore.getCoreTokenState);

    this.subManager.add(
      this.rateInfo$.subscribe((rateInfo: Rating) => {
        if (rateInfo && !rateInfo.isRated) {
          this.dialog.open(RatingComponent, {
            autoFocus: false,
            data: rateInfo,
            panelClass: 'custom-dialog-container',
          });
        }
      })
    );

    this.subManager.add(
      this.customerId$.subscribe((customerId: string) => {
        this.customerId = customerId;
      })
    );

    this.subManager.add(
      this.accessToken$.subscribe((accessToken: any) => {
        this.accessToken = accessToken;
      })
    );

    // this.subManager.add(
    //   this.coreToken$.subscribe((coreToken: any) => {
    //     this.coreToken = coreToken;
    //   })
    // );
  }
  checkMaintainTime() {
    const start = moment(this.maintainStartTime, 'DD-MM-YYYY HH:mm:ss');
    const end = moment(this.maintainEndTime, 'DD-MM-YYYY HH:mm:ss');
    const now = moment(new Date());
    if (start.isBefore(now) && now.isBefore(end)) {
      this.router.navigateByUrl('/maintain');
    }
  }

  formatTime(timeInput) {
    if (!timeInput) return;
    return moment(new Date(timeInput));
  }
}
