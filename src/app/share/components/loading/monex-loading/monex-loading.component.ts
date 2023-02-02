import { Component, OnInit } from '@angular/core';
import { PlLoading } from '../../../../public/models/plloading.model';
import * as fromStore from '../../../../core/store';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MultiLanguageService } from '../../../translate/multiLanguageService';

@Component({
  selector: 'app-monex-loading',
  templateUrl: './monex-loading.component.html',
  styleUrls: ['./monex-loading.component.scss'],
})
export class MonexLoadingComponent implements OnInit {
  loadingContent: PlLoading;
  loadingContent$: Observable<PlLoading>;
  subManager = new Subscription();

  constructor(
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService
  ) {
    this._initSubscribeState();
  }

  ngOnInit(): void {}

  _initSubscribeState() {
    this.loadingContent$ = this.store.select(fromStore.getLoadingContent);
    this.subManager.add(
      this.loadingContent$.subscribe((loadingContent: PlLoading) => {
        this.loadingContent = {
          title:
            loadingContent?.title ||
            this.multiLanguageService.instant('common.loading_title'),
          content:
            loadingContent?.content ||
            this.multiLanguageService.instant('common.loading_content'),
          showContent: loadingContent?.showContent,
        };
      })
    );
  }
}
