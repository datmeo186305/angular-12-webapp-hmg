import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  signIn() {
    this.router.navigateByUrl("/auth/sign-in")
  }

  signUp() {
    this.router.navigateByUrl("/auth/sign-up")
  }
}
