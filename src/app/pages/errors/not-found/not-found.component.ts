import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import * as fromActions from '../../../core/store';
import * as fromStore from '../../../core/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  constructor(
    private router: Router,
    // private titleService: Title,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
    // this.titleService.setTitle('Not found' + ' - ' + environment.PROJECT_NAME);
  }

  backToHome() {
    this.router.navigateByUrl('/');
  }
}
