import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, RequestOptions, Http } from '@angular/http';

import { AppComponent } from './app.component';
import { PollsComponent as ManagePollsComponent } from './manage/polls/polls.component';
import { PollEditComponent } from './manage/polls/poll-edit/poll-edit.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

import { PollsService as ManagePollsService } from './manage/polls/polls.service';
import { PollsService } from './polls/polls.service';
import { AuthService } from './auth/auth.service';
import { AccountService } from './account/account.service';
import { AuthGuard } from './auth/auth-guard.service';
import { NonAuthGuard } from './auth/non-auth-guard.service';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';

import { HeaderComponent } from './header/header.component';
import { PollDeleteComponent } from './manage/polls/poll-delete/poll-delete.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { PollsComponent } from './polls/polls.component';
import { PollComponent } from './polls/poll.component';
import { FooterComponent } from './footer/footer.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { MenuTogglerDirective } from './header/menu-toggler.directive';

@NgModule({
  declarations: [
    AppComponent,
    ManagePollsComponent,
    PollEditComponent,
    LoginComponent,
    HeaderComponent,
    PollDeleteComponent,
    NotFoundComponent,
    AccountComponent,
    SignupComponent,
    HomeComponent,
    PollsComponent,
    FooterComponent,
    PaginationComponent,
    PollComponent,
    MenuTogglerDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    AuthModule
  ],
  providers: [
    ManagePollsService,
    PollsService,
    AuthService,
    AccountService,
    AuthGuard,
    NonAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
