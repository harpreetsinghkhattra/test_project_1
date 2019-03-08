import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['',[Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit() {
  }

  email = (value: string) => value === "pristine" ? this.loginForm.controls.email.pristine : this.loginForm.controls.email.hasError(value);
  password = (value: string) => value === "pristine" ? this.loginForm.controls.password.pristine : this.loginForm.controls.password.hasError(value);
  isLoginFormValid = () => this.loginForm.invalid;

  onSubmit = (data) => {
    console.log(data);
  }

}
