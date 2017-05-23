import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  error: string;
  timeoutID: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'email': new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      'firstName': new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(30)
      ]),
      'lastName': new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(30)
      ]),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]),
      'confirmPassword': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ])
    });
  }

  ngOnDestroy() {
    this.onCloseError();
  }

  onCloseError() {
    if(this.timeoutID) {
      this.error = '';
      clearTimeout(this.timeoutID);
    }
  }

  onSubmit() {
    const { email, firstName, lastName, password, confirmPassword } = this.registerForm.value;
    this.authService.signup(email, firstName, lastName, password, confirmPassword)
      .then((data: any) => this.router.navigate(['/manage/polls']))
      .catch((error: string) => this.showError(error));
  }

  private showError(error: string) {
    this.error = error;
    this.timeoutID = setTimeout(() => {
      this.error = '';
    }, 5000);
  }

}
