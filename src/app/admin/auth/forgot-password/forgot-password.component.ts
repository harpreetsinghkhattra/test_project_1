import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  private forgotPasswordForm: FormGroup;
  constructor(private fb: FormBuilder) { 
    this.forgotPasswordForm = this.fb.group({
      email: ['',[Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.required]]
    });
  }

  email = (value: string) => value === "pristine" ? this.forgotPasswordForm.controls.email.pristine : this.forgotPasswordForm.controls.email.hasError(value);
  isForgotPasswordValid = () => this.forgotPasswordForm.invalid;

  ngOnInit() {
  }

  onSubmit = (value) => {
    console.log(value);
  }

}
