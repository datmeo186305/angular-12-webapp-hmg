import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Title } from '@angular/platform-browser';
import * as fromStore from '../../../../core/store';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../../core/store';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';

@Component({
  selector: 'app-introduce',
  templateUrl: './introduce.component.html',
  styleUrls: ['./introduce.component.scss'],
})
export class IntroduceComponent implements OnInit, AfterViewInit {
  guideVideoUrl: string = environment.VIDEO_GUIDE_URL;

  constructor(
    private router: Router,
    //private titleService: Title,
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {
    // this.titleService.setTitle('Hướng dẫn' + ' - ' + environment.PROJECT_NAME);
  }

  start() {
    this.router.navigateByUrl('/auth/sign-in').then((r) => {});
  }

  ngAfterViewInit(): void {
    this.initHeaderInfo();
    this.resetSession();
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetNavigationTitle('Ứng lương 0% lãi'));
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }
}
