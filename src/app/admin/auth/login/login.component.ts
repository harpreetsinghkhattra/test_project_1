import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import { IshaanviApiService } from '../../ishaanvi-api.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { IshaanviAppDataService } from '../../ishaanvi-app-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public loginForm: FormGroup;
  public isLoading: boolean;
  constructor(private fb: FormBuilder, public api: IshaanviApiService, private router: Router, private userInfo: IshaanviAppDataService) {
    this.loginForm = this.fb.group({
      email: ['ttttester101@gmail.com', [Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.required]],
      password: ['1', [Validators.required]]
    })
  }

  email = (value: string) => value === "pristine" ? this.loginForm.controls.email.pristine : this.loginForm.controls.email.hasError(value);
  password = (value: string) => value === "pristine" ? this.loginForm.controls.password.pristine : this.loginForm.controls.password.hasError(value);
  isLoginFormValid = () => this.loginForm.invalid;

  onSubmit = (data) => {
    if (this.isLoading) return;
    this.isLoading = true;
    this.api.login(data).subscribe(res => {
      const { message, data } = res;
      console.log(res);
      switch (message.toLowerCase()) {
        case this.api.SUCCESS.toLowerCase():
          this.userInfo.setUserInfo(data);
          data && data.forgetPassword ? this.router.navigate(["/resetPassword"]) : this.router.navigate(["/admin/dashboard"]);
          break;
        case this.api.NOT_VALID.toLowerCase():
          swal.fire("Warning", "Email/Password is incorrect, please try again!", "warning");
          break;
        default:
          swal.fire("Warning", "Please try again", "warning");
      }
    }, (error) => {
      console.log('error ===> ', error);
      this.isLoading = false;
      swal.fire("Warning", "Something went wrong, please try again", "warning");
    }, () => {
      this.isLoading = false;
    })
  }
}
