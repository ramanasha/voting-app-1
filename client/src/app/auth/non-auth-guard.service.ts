import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class NonAuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router) {}

  canActivate() {
    if(this.auth.isAuthenticated()) {
      this.router.navigate(['manage/polls']);
      return false;
    } else {
      return true;
    }
  }
}
