import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IshaanviApiService } from "../../../ishaanvi-api.service";
import { IshaanviAppDataService } from '../../../ishaanvi-app-data.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { UserModel } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public resetPasswordForm: FormGroup;
  public isLoading: boolean = false;
  public userData: UserModel = new UserModel();
  constructor(private fb: FormBuilder, private api: IshaanviApiService, private router: Router, private userInfo: IshaanviAppDataService) {
    this.resetPasswordForm = this.fb.group({
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });

    this.userData.deserialize(this.userInfo.getUserInfo());
    console.log(this.userData);
    if (!this.userData || (this.userData && !this.userData._id)) this.router.navigate(["/login"]);
  }

  password = (value: string) => value === "pristine" ? this.resetPasswordForm.controls.password.pristine : this.resetPasswordForm.controls.password.hasError(value);
  confirmPassword = (value: string) => value === "pristine" ? this.resetPasswordForm.controls.confirmPassword.pristine : this.resetPasswordForm.controls.confirmPassword.hasError(value);
  isResetPasswordFormValid = () => this.resetPasswordForm.invalid;

  isPasswordMatch = ({ password, confirmPassword }: any): boolean => {
    return password !== confirmPassword && !this.confirmPassword('pristine') && !this.password('pristine') ? true : false;
  }

  ngOnInit() {

  }

  onSubmit = (value) => {
    this.isLoading = false;
    this.api.resetPassword({
      email: this.userData.email,
      password: value.password
    }).subscribe(res => {
      console.log(res);

      const { message, data } = res;
      switch (message.toLowerCase()) {
        case this.api.SUCCESS.toLowerCase():
          this.router.navigate(["/admin/dashboard"]);
          break;
        case this.api.NOVALUE.toLowerCase():
          swal.fire("Warning", "No user found, please try again!", "warning");
          break;
        default:
          swal.fire("Warning", "Please try again!", "warning");
      }
    }, (error) => {
      console.log(error);
      this.isLoading = false;
      swal.fire("Warning", "Something went wrong, Please try again", "warning");
    }, () => this.isLoading = false);
  }

}
