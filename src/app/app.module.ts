import { BrowserModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './admin/auth/register/register.component';
import { LoginComponent } from './admin/auth/login/login.component';
import { NotFoundComponent } from './admin/auth/not-found/not-found.component';
import { ForgotPasswordComponent } from './admin/auth/forgot-password/forgot-password.component';
import { LandingComponent } from './admin/auth/landing/landing.component';
import { LoaderComponent } from './admin/loader/loader.component';
import { ResetPasswordComponent } from './admin/dashboard/home/reset-password/reset-password.component';

import { IshaanviApiService } from './admin/ishaanvi-api.service';
import { IshaanviAuthInterceptorService } from './admin/ishaanvi-auth-interceptor.service';
import { IshaanviAppDataService } from './admin/ishaanvi-app-data.service';
import { IshaanviAuthService } from './admin/ishaanvi-auth.service';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NotFoundComponent,
    ForgotPasswordComponent,
    LandingComponent,
    LoaderComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'tour-of-heroes' }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: IshaanviAuthInterceptorService, multi: true },
    IshaanviApiService, 
    IshaanviAppDataService,
    IshaanviAuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: Object
  ) {
    const platform = isPlatformBrowser(PLATFORM_ID) ?
      "in the browser" : "on the server";

    console.log(`Running ${platform} with appId = {appId}`)
  }
}
