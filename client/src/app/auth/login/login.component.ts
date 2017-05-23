import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  error: string;
  timeoutID: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [
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
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
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
