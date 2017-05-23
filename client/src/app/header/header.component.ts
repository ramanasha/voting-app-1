import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuExpanded: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router) { }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  loggedIn() {
    return this.auth.isAuthenticated();
  }
}
