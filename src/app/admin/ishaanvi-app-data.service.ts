import { Injectable } from '@angular/core';
import { UserModel } from '../shared/models/user.model';
import {
  ISHAANVI_STORAGE_USER_DATA
} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class IshaanviAppDataService {

  userInfo: UserModel = new UserModel();
  constructor() {
  }

  /** Set user info */
  setUserInfo(value: UserModel) {
    if (!value._id) return;
    localStorage.setItem(ISHAANVI_STORAGE_USER_DATA, JSON.stringify(value));
    this.userInfo.deserialize(value);
  }

  /** Get user info */
  getUserInfo() {
     return this.userInfo;
  }

  /** Get user info from local storage */
  getUserInfoFromLocalStorage() {
    if (this.userInfo._id) return this.userInfo;

    const data: string = localStorage.getItem(ISHAANVI_STORAGE_USER_DATA);
    this.userInfo.deserialize(JSON.parse(data ? data : "{}"));

    return this.userInfo;
  }
}
