import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as fromStore from '../../../../core/store';
import * as fromActions from '../../../../core/store';
import {environment} from 'src/environments/environment';
import {Store} from '@ngrx/store';
import {MultiLanguageService} from '../../../../share/translate/multiLanguageService';
import {TitleConstants} from "../../../../core/common/title-constants";

@Component({
  selector: 'app-maintenance-company',
  templateUrl: './maintenance-company.component.html',
  styleUrls: ['./maintenance-company.component.scss'],
})
export class MaintenanceCompanyComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {
    this.resetSession();
    this.checkFinishMaintainTime();
  }

  ngAfterViewInit(): void {
    this.initHeaderInfo();
  }

  checkFinishMaintainTime() {
    if (!environment.MAINTAIN_TNG) {
      this.router.navigateByUrl('/');
    }
  }

  initHeaderInfo() {
    this.store.dispatch(
      new fromActions.SetNavigationTitle(
       ""
      )
    );
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }
}
