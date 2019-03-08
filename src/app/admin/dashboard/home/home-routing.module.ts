import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { UsersComponent } from './users/users.component';
import { BlockedUsersComponent } from './blocked-users/blocked-users.component';
import { PostNotificationComponent } from './post-notification/post-notification.component';
import { UploadBannerComponent } from './upload-banner/upload-banner.component';

const routes: Routes = [
  { path: 'home/routing', redirectTo: '', pathMatch: 'full' },
  {
    path: '', component: HomeComponent, children: [
      { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: LandingComponent },
      { path: 'users/all', component: UsersComponent },
      { path: 'users/blocked', component: BlockedUsersComponent },
      { path: 'notification/post', component: PostNotificationComponent },
      { path: 'banner/post', component: UploadBannerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
