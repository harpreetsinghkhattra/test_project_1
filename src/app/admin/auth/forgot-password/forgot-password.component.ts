import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IshaanviApiService } from '../../ishaanvi-api.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordForm: FormGroup;
  public isLoading: boolean;
  constructor(private fb: FormBuilder, private api: IshaanviApiService, public router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.required]]
    });
  }

  email = (value: string) => value === "pristine" ? this.forgotPasswordForm.controls.email.pristine : this.forgotPasswordForm.controls.email.hasError(value);
  isForgotPasswordValid = () => this.forgotPasswordForm.invalid;

  ngOnInit() {
  }

  onSubmit = (value) => {
    if (this.isLoading) return;

    this.isLoading = true;
    this.api.forgetPassword(value).subscribe(res => {
      const { message, data } = res;
      console.log(res);
      switch (message.toLowerCase()) {
        case this.api.SUCCESS.toLowerCase():
          this.router.navigate(["/login"]);
          break;
        case this.api.NOVALUE.toLowerCase():
          swal.fire("Warning", "No related data found, please try again!");
          break;
        default:
          swal.fire("Warnign", "Please try again!", "warning");
      }
    }, () => {
      this.isLoading = false;
      swal.fire("Warning", "Something went wrong, please try again!", "warning");
    }, () => this.isLoading = false);
  }

}
