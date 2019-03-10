import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { IshaanviApiService } from '../../../ishaanvi-api.service';
import { IshaanviAppDataService } from '../../../ishaanvi-app-data.service';
import { UserModel } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-upload-banner',
  templateUrl: './upload-banner.component.html',
  styleUrls: ['./upload-banner.component.css']
})
export class UploadBannerComponent implements OnInit {

  public selectedFiles: any;
  public isUploading: boolean;
  public userData: UserModel = new UserModel();
  constructor(
    private userInfo: IshaanviAppDataService,
    private api: IshaanviApiService
  ) { }

  ngOnInit() {
    this.userData.deserialize(this.userInfo.getUserInfo());
  }

  onChangeFile = (value) => {
    if (value && value.length) this.selectedFiles = value;
  }

  confirmUploadImages = () => {
    if (!this.selectedFiles || (this.selectedFiles && !this.selectedFiles.length)) {
      swal.fire("Warning", "No selected file found!", "warning");
    } else if (this.selectedFiles && this.selectedFiles.length > 6) {
      swal.fire("Warning", "You can maximum only 6 images");
    } else {
      swal.fire({
        text: "You want to upload these images!",
        title: 'Are you sure?',
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ok'
      }).then(({ value }: any) => {
        if (value) this.uploadImages();
      });
    }
  }

  uploadImages = () => {
    if (this.isUploading) return;

    const formValue: any = new FormData();
    const fileKeys = Object.keys(this.selectedFiles);
    formValue.append('id', this.userData._id);
    formValue.append('accessToken', this.userData.userAccessToken);
    fileKeys.forEach(ele => {
      formValue.append('images', this.selectedFiles[ele]);
    })
    this.isUploading = true;
    this.api.uploadImages(formValue).subscribe(res => {
      console.log(res);
      const { message } = res;
      switch (message.toLowerCase()) {
        case this.api.SUCCESS.toLowerCase():
          swal.fire("Successfuly", "Images uploaded on cloud", "success");
          break;
        default:
          swal.fire("Warning", "Please try again!", "warning");
      }
    }, (error) => {
      console.log(error);
      this.isUploading = false;
      swal.fire("Warning", "Something went wrong, please try again!", "success");
    }, () => this.isUploading = false);
  }
}
