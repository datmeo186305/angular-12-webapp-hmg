import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-landing-page',
  templateUrl: './header-landing-page.component.html',
  styleUrls: ['./header-landing-page.component.scss'],
})
export class HeaderLandingPageComponent implements OnInit{
  @Input() activeLink: string = '';
  @ViewChild('sidenav') sidenav;
  isSideNavOpen: boolean = false;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  redirectToHome() {
    this.router.navigateByUrl('/');
  }

  redirectToLogin() {
    this.router.navigateByUrl('/auth/sign-in');
  }

  openSideNav() {
    this.sidenav.open();
    this.isSideNavOpen = true;
  }

  closeSideNav() {
    this.sidenav.close();
    this.isSideNavOpen = false;
  }
}
