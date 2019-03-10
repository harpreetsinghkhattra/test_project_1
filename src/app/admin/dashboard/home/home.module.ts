import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { LandingComponent } from './landing/landing.component';
import { UsersComponent } from './users/users.component';
import { BlockedUsersComponent } from './blocked-users/blocked-users.component';
import { PostNotificationComponent } from './post-notification/post-notification.component';
import { UploadBannerComponent } from './upload-banner/upload-banner.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [HomeComponent, HeaderComponent, SidebarComponent, FooterComponent, LandingComponent, UsersComponent, BlockedUsersComponent, PostNotificationComponent, UploadBannerComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
