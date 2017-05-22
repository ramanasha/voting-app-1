import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';
import { Account } from './account';

@Injectable()
export class AccountService {
  apiUrl: string = environment.apiRootUrl;

  constructor(private authHttp: AuthHttp) { }

  getAccount() {
    return this.authHttp.get(`${this.apiUrl}/account`)
      .toPromise()
      .then((response: Response) => {
        const data = <Account>response.json().data;
        return data;
      })
      .catch(this.handleError);
  }

  updateAccount(email: string, firstName: string, lastName: string, password?: string, confirmPassword?: string) {
    let body: any = { email, firstName, lastName };
    if(password) {
      body.password = password;
      body.confirmPassword = confirmPassword;
    }
    return this.authHttp.post(`${this.apiUrl}/account`, body)
      .toPromise()
      .then((response: Response) => {
        const data = <Account>response.json().data;
        return data;
      })
      .catch(this.handleError);
  }

  private handleError(err: any): Promise<any> {
    if(err instanceof Response) {
      const { error } = err.json();
      return Promise.reject(error.message || error);
    }
    return Promise.reject(err.message || err);
  }
}
