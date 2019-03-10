import { Component, OnInit } from '@angular/core';
import { IshaanviApiService } from '../../../ishaanvi-api.service';
import { IshaanviAppDataService } from '../../../ishaanvi-app-data.service';
import { UserModel } from '../../../../shared/models/user.model';
import { ISHAANVI_STORAGE_USER_DATA } from '../../../../config/config';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public userData: UserModel = new UserModel();
  public isLoading: boolean;
  constructor(
    private api: IshaanviApiService,
    private userInfo: IshaanviAppDataService,
    private router: Router
  ) {
  }

  confirmLogout = () => {
    swal.fire({
      text: "You want to signout!",
      title: 'Are you sure?',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ok'
    }).then(({ value }: any) => {
      if (value) this.logout();
    });
  }

  logout = () => {
    if (this.isLoading) return;

    this.api.logout({
      id: this.userData._id,
      accessToken: this.userData.userAccessToken
    }).subscribe(res => {
      console.log(res);
      const { data, message } = res;
      switch (message.toLowerCase()) {
        case this.api.SUCCESS.toLowerCase():
          localStorage.removeItem(ISHAANVI_STORAGE_USER_DATA);
          this.router.navigate(["/login"]);
          break;
        default:
          swal.fire("Warning", "Please try again", "warning");
      }
    }, (error) => {
      console.log(error);
      swal.fire("Warning", "Something went wrong, please try again", "warning");
      this.isLoading = false;
    }, () => this.isLoading = false);
  }

  ngOnInit() {
    this.userData.deserialize(this.userInfo.getUserInfo());
  }

}
