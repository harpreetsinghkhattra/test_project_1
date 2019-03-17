import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { IshaanviApiService } from '../../../ishaanvi-api.service';
import { IshaanviAppDataService } from '../../../ishaanvi-app-data.service';
import { UserModel } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  public data: any;
  public isLoading: boolean;
  public userData: UserModel = new UserModel();
  constructor(
    private userInfo: IshaanviAppDataService,
    private api: IshaanviApiService
  ) { }

  ngOnInit() {
    this.userData.deserialize(this.userInfo.getUserInfo());
    this.getHomeData();
  }

  getSellerCount = (type: string) => {
    if (!this.data || (this.data && !this.data.length)) return 0;
    
    const value = this.data[this.data.findIndex(ele => ele._id === "sellers")];
    switch (type) {
      case "active":
        return value.active;
      case "blocked":
        return value.deactive;
      default:
        return value.total;
    }
  }

  getConsumerCount = (type: string) => {
    if (!this.data || (this.data && !this.data.length)) return 0;

    const value = this.data[this.data.findIndex(ele => ele._id === "consumers")];
    
    switch (type) {
      case "active":
        return value.active;
      case "blocked":
        return value.deactive;
      default:
        return value.total;
    }
  }

  getProductsCount = (type: string) => {
    if (!this.data || (this.data && !this.data.length)) return 0;

    const value = this.data[this.data.findIndex(ele => ele._id === "consumers")];
    console.log("data ===> sellers", this.data);
    
    switch (type) {
      case "active":
        return value.products.active;
      case "blocked":
        return value.products.deactivated;
      default:
        return value.products.totalProducts;
    }
  }

  getHomeData = () => {
    if (this.isLoading) return;

    this.isLoading = true;
    this.api.getTotalUsersAndProducts({
      id: this.userData._id,
      accessToken: this.userData.userAccessToken
    }).subscribe(res => {
      console.log(res);
      const { message, data } = res;
      switch (message.toLowerCase()) {
        case this.api.SUCCESS.toLowerCase():
          this.data = data;
          break;
        default:
          swal.fire("Warning", "Please try again!", "warning");
      }
    }, (error) => {
      console.log(error);
      this.isLoading = false;
      swal.fire("Warning", "Something went wrong, please try again!", "success");
    }, () => this.isLoading = false);
  }

}
