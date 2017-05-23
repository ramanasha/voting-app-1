import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  private apiUrl = environment.apiRootUrl + '/auth';
  token: string;
  user: any;

  constructor(
    private http: Http,
    private router: Router) { }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, {email, password})
      .toPromise()
      .then((response: Response) => {
        const res = response.json();
        const { token, user } = res.data;
        this.user = user;
        this.token = token;
        this.loginUser();
      })
      .catch(this.handleError);
  }

  signup(email: string, firstName: string, lastName: string, password: string, confirmPassword: string) {
    const body = { email, firstName, lastName, password, confirmPassword };
    return this.http.post(`${this.apiUrl}/register`, body)
      .toPromise()
      .then((response: Response) => {
        const res = response.json();
        const { token, user } = res.data;
        this.user = user;
        this.token = token;
        this.loginUser();
      })
      .catch(this.handleError);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user = null;
    this.token = null;
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return tokenNotExpired();
  }

  getUser() {
    return this.user;
  }

  updateToken(token: string, user: any) {
    this.user = user;
    this.token = token;
    this.loginUser();
  }

  private handleError(err: any): Promise<any> {
    if(err instanceof Response) {
      const { error } = err.json();
      return Promise.reject(error.message || error);
    }
    return Promise.reject(err.message || err);
  }

  private loginUser() {
    localStorage.setItem('token', this.token);
    localStorage.setItem('user', JSON.stringify(this.user));
  }
}
