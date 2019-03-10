import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { IshaanviApiService } from '../../../ishaanvi-api.service';
import { IshaanviAppDataService } from '../../../ishaanvi-app-data.service';
import { UserModel } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-post-notification',
  templateUrl: './post-notification.component.html',
  styleUrls: ['./post-notification.component.css']
})
export class PostNotificationComponent implements OnInit {

  public userData: UserModel = new UserModel();
  public postNotificationForm: FormGroup;
  public isLoading: boolean;
  constructor(
    private userInfo: IshaanviAppDataService,
    private api: IshaanviApiService,
    private fb: FormBuilder
  ) {
    this.postNotificationForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  title = (value) => value === "pristine" ? this.postNotificationForm.controls.title.pristine : this.postNotificationForm.controls.title.hasError(value);
  description = (value) => value === "pristine" ? this.postNotificationForm.controls.description.pristine : this.postNotificationForm.controls.description.hasError(value);
  isPostNotificationValid = () => this.postNotificationForm.invalid;

  ngOnInit() {
    this.userData.deserialize(this.userInfo.getUserInfo());
  }

  onSubmit(value: any) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.api.sendPushNotification({
      id: this.userData._id,
      accessToken: this.userData.userAccessToken,
      title: value.title,
      description: value.description
    }).subscribe(res => {
      console.log(res);
      const { data, message } = res;
      switch (message.toLowerCase()) {
        case this.api.SUCCESS.toLowerCase():
          swal.fire("Sucessfully", "Notification sent!", "success");
          break;
        default:
          swal.fire("Warning", "Please try again!", 'warning');
      }
    }, (error) => {
      console.log(error);
      this.isLoading = false;
      swal.fire("Warning", "Something went wrong, please try again!");
    }, () => this.isLoading = false);
  }
}
