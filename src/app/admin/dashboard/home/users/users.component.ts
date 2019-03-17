import { Component, OnInit } from '@angular/core';
import { IshaanviApiService } from '../../../ishaanvi-api.service';
import { UserModel } from '../../../../shared/models/user.model';
import { IshaanviAppDataService } from '../../../ishaanvi-app-data.service';
import swal from 'sweetalert2';
import { ISHAANVI_ALL, ISHAANVI_SELLER, ISHAANVI_CONSUMER, ISHAANVI_BLOCK_USER } from '../../../../config/config';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public userData: UserModel = new UserModel();
  public isLoading: boolean;
  public usersList: UserModel[];
  public isBlockedUserLoading: boolean;
  public page: any = 1;
  public maxPageItems: any = 10;
  public selectedUserType: number = ISHAANVI_ALL;
  constructor(
    private api: IshaanviApiService,
    private userInfo: IshaanviAppDataService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.userData.deserialize(this.userInfo.getUserInfo());
    this.getAllUsers();
  }

  getUserImage(link) {
    if (!link) return "/assets/images/profile.png";

    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  selectUserType(value: string) {
    switch (value) {
      case "0":
        this.selectedUserType = ISHAANVI_ALL;
        break;
      case "1":
        this.selectedUserType = ISHAANVI_SELLER;
        break;
      case "2":
        this.selectedUserType = ISHAANVI_CONSUMER;
        break;
    }

    this.getAllUsers();
  }

  getAllUsers = () => {
    if (this.isLoading) return;

    this.isLoading = true;
    this.api.getAllUsers({
      id: this.userData._id,
      accessToken: this.userData.userAccessToken
    }).subscribe(res => {
      console.log(res);
      const { data, message } = res;
      switch (message.toLowerCase()) {
        case this.api.SUCCESS.toLowerCase():
          this.usersList = data && data.length ? this.selectedUserType === 0 ? data : data.filter(ele => ele.userType === this.selectedUserType) : [];
          break;
        case this.api.NOVALUE.toLowerCase():
          this.usersList = [];
          break;
        default:
          this.usersList = [];
      }
    }, (error) => {
      console.log(error);
      swal.fire("Warning", "Something went wrong, please try again!", "warning");
      this.isLoading = false;
    }, () => this.isLoading = false);
  }

  confirmUserBlock = (userId: UserModel) => {
    swal.fire({
      text: `You want to ${userId.deletedStatus === ISHAANVI_BLOCK_USER ? "unblock" : "block"} this user!`,
      title: 'Are you sure?',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ok'
    }).then(({ value }: any) => {
      if (value) this.blockUser(userId);
    });
  }

  blockUser = (userId: UserModel) => {
    if (this.isBlockedUserLoading) return;

    this.isBlockedUserLoading = true;
    this.api.blockUser({
      id: this.userData._id,
      accessToken: this.userData.userAccessToken,
      userId: userId._id
    }).subscribe(res => {
      console.log(res);
      const { data, message } = res;
      switch (message.toLowerCase()) {
        case this.api.SUCCESS.toLowerCase():
          swal.fire("Success", `User has been successfully ${ userId.deletedStatus === ISHAANVI_BLOCK_USER ? "unblocked" : "blocked"}!`, "success");
          this.getAllUsers();
          break;
        case this.api.NOVALUE.toLowerCase():
          swal.fire("Warning", "No record found, please try again", "warning");
          break;
        default:
          swal.fire("Warning", "Please try again!", "warning");
      }
    }, (error) => {
      console.log(error);
      swal.fire("Warning", "Something went wrong, please try again!", "warning");
      this.isBlockedUserLoading = false;
    }, () => this.isBlockedUserLoading = false);
  }

}
