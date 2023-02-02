import { Component, OnInit } from '@angular/core';
import { MultiLanguageService } from './share/translate/multiLanguageService';
import { fadeAnimation } from './core/common/animations/router.animation';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { GlobalConstants } from './core/common/global-constants';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeAnimation,
    // animation triggers go here
  ],
})
export class AppComponent implements OnInit {
  title = 'Ứng lương 0% lãi';

  constructor(
    private multiLanguageService: MultiLanguageService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    multiLanguageService.changeLanguage('vi');
    // this.multiLanguageService.onSetupMultiLanguage('insurance');
    // this.multiLanguageService.onSetupMultiLanguage('payday-loan');
    // this.multiLanguageService.onSetupMultiLanguage("payment")
  }

  ngOnInit(): void {
    this.setBrowserTabTitle();
  }

  private setBrowserTabTitle(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        map((route) => this.getRouteFirstChild(route)),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) =>
        this.titleService.setTitle(this.buildTitle(event['title']))
      );
  }

  private getRouteFirstChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }

  private buildTitle(pageTitle: string): string {
    if (pageTitle) {
      return [pageTitle, environment.PROJECT_NAME].join(
        environment.BROWSER_TAB_TITLE_DELIMITER
      );
    }

    return environment.PROJECT_NAME;
  }
}
