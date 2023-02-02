import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from './../../../core/store';
import * as fromActions from './../../../core/store';
// import { Title } from '@angular/platform-browser';
// import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { EventTetComponent } from '../../payday-loan/components/event-tet/event-tet.component';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, AfterViewInit {
  signInForm: FormGroup;
  isUsernameInputFocus: boolean = false;
  isPasswordInputFocus: boolean = false;

  isPassVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<fromStore.State>, //private titleService: Title
    private dialog: MatDialog
  ) {
    this.signInForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    // this.titleService.setTitle('Đăng nhập' + ' - ' + environment.PROJECT_NAME);
    this.resetSession();
    this.initHeaderInfo();
  }

  ngAfterViewInit() {
    //Popup event Luna year
    if (
      moment().isBetween(
        moment('15/01/2022', 'DD/MM/yyyy'),
        moment('16/03/2022', 'DD/MM/yyyy')
      )
    ) {
      this.openEventTetDialog();
    }
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      return;
    }

    const username = this.signInForm.controls.mobileNumber.value;
    const password = this.signInForm.controls.password.value;

    this.store.dispatch(new fromActions.Signin({ username, password }));
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetNavigationTitle('Đăng nhập'));
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }

  openEventTetDialog() {
    this.dialog.open(EventTetComponent, {
      autoFocus: false,
      panelClass: 'custom-dialog-container',
    });
  }
}
