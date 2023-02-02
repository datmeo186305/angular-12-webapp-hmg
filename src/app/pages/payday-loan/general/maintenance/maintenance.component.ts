import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Title } from '@angular/platform-browser';
import * as fromStore from '../../../../core/store';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../../core/store';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import * as moment from 'moment';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent implements OnInit, AfterViewInit {
  maintainStartTime: string = environment.MAINTAINANCE_START_TIME;
  maintainEndTime: string = environment.MAINTAINANCE_END_TIME;
  startTimeDisplay: string;
  endTimeDisplay: string;
  startDateDisplay: string;
  endDateDisplay: string;
  constructor(
    private router: Router,
    //private titleService: Title,
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {
    // this.titleService.setTitle(
    //   'Bảo trì' + ' - ' + environment.PROJECT_NAME
    // );

    //Time
    this.startTimeDisplay = moment(
      this.maintainStartTime,
      'DD-MM-YYYY HH:mm:ss'
    ).format('HH:mm');

    this.endTimeDisplay = moment(
      this.maintainEndTime,
      'DD-MM-YYYY HH:mm:ss'
    ).format('HH:mm');

    //Date
    this.startDateDisplay = moment(
      this.maintainStartTime,
      'DD-MM-YYYY HH:mm:ss'
    ).format('DD-MM-YYYY');

    this.endDateDisplay = moment(
      this.maintainEndTime,
      'DD-MM-YYYY HH:mm:ss'
    ).format('DD-MM-YYYY');

    this.resetSession();
    this.checkFinishMaintainTime();
  }

  ngAfterViewInit(): void {
    this.initHeaderInfo();
  }

  checkFinishMaintainTime() {
    const start = moment(this.maintainStartTime, 'DD-MM-YYYY HH:mm:ss');
    const end = moment(this.maintainEndTime, 'DD-MM-YYYY HH:mm:ss');
    const now = moment(new Date());
    if (now.isBefore(start) || end.isBefore(now)) {
      this.router.navigateByUrl('/');
    }
  }

  initHeaderInfo() {
    this.store.dispatch(
      new fromActions.SetNavigationTitle(
        this.multiLanguageService.instant('payday_loan.system_maintainance')
      )
    );
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }
}
