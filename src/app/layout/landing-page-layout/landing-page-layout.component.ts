import {AfterViewInit, Component, OnInit,} from '@angular/core';
import {Router,} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {MultiLanguageService} from '../../share/translate/multiLanguageService';
import {Store} from '@ngrx/store';
import * as fromStore from '../../core/store';
import {MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-landing-page-layout',
  templateUrl: './landing-page-layout.component.html',
  styleUrls: ['./landing-page-layout.component.scss'],
})
export class LandingPageLayoutComponent implements OnInit, AfterViewInit {
  currentLink: string = '';
  loadingStatus$: Observable<boolean>;
  maintainStartTime: string = environment.MAINTAINANCE_START_TIME;
  maintainEndTime: string = environment.MAINTAINANCE_END_TIME;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private router: Router
  ) {
    this._initSubscribeState();
    // this.checkMaintainTime();
  }

  async ngOnInit() {
    console.log(this.router.url);
    this.currentLink = this.router.url.toString();
    await this.multiLanguageService.changeLanguage('vi');
    await this.multiLanguageService.use('vi');
  }
  ngAfterViewInit() {}

  _initSubscribeState() {
    this.loadingStatus$ = this.store.select(fromStore.getLoadingStatus);
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
