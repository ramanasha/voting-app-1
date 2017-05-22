import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PollsComponent } from './polls/polls.component';
import { PollComponent } from './polls/poll.component';
import { PollsComponent as ManagePollsComponent } from './manage/polls/polls.component';
import { PollEditComponent as ManagePollEditComponent } from './manage/polls/poll-edit/poll-edit.component';
import { PollDeleteComponent as ManagePollDeleteComponent } from './manage/polls/poll-delete/poll-delete.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AccountComponent } from './account/account.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { AuthGuard } from './auth/auth-guard.service';
import { NonAuthGuard } from './auth/non-auth-guard.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'polls', component: PollsComponent, children: [
    { path: ':id', component: PollComponent },
  ] },
  { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [NonAuthGuard] },

  { path: 'manage/polls', component: ManagePollsComponent, canActivate: [AuthGuard], children: [
    { path: 'new', component: ManagePollEditComponent },
    { path: ':id/delete', component: ManagePollDeleteComponent },
    { path: ':id', component: ManagePollEditComponent },
  ] },

  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
