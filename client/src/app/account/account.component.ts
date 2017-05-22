import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from './account.service';
import { AuthService } from '../auth/auth.service';
import { Account } from './account';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  accountForm: FormGroup;
  account: Account;
  error: string;
  msg: string;
  timeoutID: any;

  constructor(
    private accountService: AccountService,
    private authService: AuthService) { }

  ngOnInit() {
    this.accountForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'firstName': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]),
      'lastName': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]),
      'password': new FormControl('', [
        Validators.minLength(6),
        Validators.maxLength(20)
      ]),
      'confirmPassword': new FormControl('', [
        Validators.minLength(6),
        Validators.maxLength(20),
        // this.passwordConfirmationNotMatch.bind(this)
      ])
    });
    this.accountService.getAccount()
      .then((data: Account) => {
        this.account = data;
        this.initForm();
      })
      .catch((error: string) => this.showErroMsg(error, 'error'));
  }

  ngOnDestroy() {
    this.closeMsg();
  }

  onSubmit() {
    const { email, firstName, lastName, password, confirmPassword } = this.accountForm.value;
    this.accountService.updateAccount(email, firstName, lastName, password, confirmPassword)
      .then((data: any) => {
        this.authService.updateToken(data.token, data.user);
        this.showErroMsg('Successfully updated your account!', 'msg');
      })
      .catch((error: string) => this.showErroMsg(error, 'error'));
  }

  closeMsg() {
    if(this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
    this.msg = '';
    this.error = '';
  }

  private initForm() {
    const { email, firstName, lastName } = this.account;
    this.accountForm.setValue({ email, firstName, lastName, password: '', confirmPassword: '' });
  }

  private showErroMsg(msg: string, type: string) {
    this.closeMsg();

    if(type === 'error') this.error = msg;
    else  this.msg = msg;

    this.timeoutID = setTimeout(() => {
      this.msg = '';
      this.error = '';
    }, 5000);
  }

  // passwordConfirmationNotMatch(c: FormControl): {[s: string]: boolean} {
  //   const password = this.accountForm.controls.password.value;
  //   return c.value === password ? null : {
  //     'passwordConfirmationNotMatch': true
  //   }
  // }

}
