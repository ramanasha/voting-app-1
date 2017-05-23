import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import { AuthHttp, AuthConfig } from 'angular2-jwt';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{ 'Content-Type': 'application/json' }],
  }), http, options);
}

export const authProvider = {
  provide: AuthHttp,
  deps: [Http, RequestOptions],
  useFactory: authHttpServiceFactory
};

@NgModule({
  providers: [authProvider]
})
export class AuthModule { }
