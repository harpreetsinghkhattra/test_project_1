import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, ForgetPasswordRequest, ResetPasswordRequest, RefundBookingAmount, AddPackage, DeletePackage, UpdatePackage, SetCommissionRate, PreRegisterEmail, CancelSubscription, FinancialReportRequest, GetUserRequest, LogoutRequest, GetAllUsersRequest, BlockUser, GetBlockedUsers, SendNotificationRequest, UploadImagesRequest, GetHomeAdminData } from './request.interface';
import { Observable } from 'rxjs';
import { Response } from './response.interface';


@Injectable({
  providedIn: 'root'
})
export class IshaanviApiService {

  public NOT_VALID: string = 'notValid';
  public SUCCESS: string = 'success';
  public SUCCESS_WITH_EMAIL_CHANGE: string = 'successWithEmailChange';
  public SUCCESS_WITH_MOBILE_CHANGE: string = 'successWithMobileChange';
  public ERROR: string = 'err';
  public PRESENT: string = 'present';
  public NOVALUE: string = 'noValue';
  public OBJECT_EMPTY: string = 'objEmpty';
  public TOKEN_ERROR: string = 'tokenErr';
  public VALIDATE_ERROR: string = 'validationErr';
  public VARIFICATION_ERROR: string = 'verificationErr';
  // public BASE_URL: string = "http://13.127.188.164/api";
  public BASE_URL: string = "http://localhost:3000/api";
  public EMAIL_PRESENT: string = "emailPresent";
  public LOGED_IN: string = "logedIn";
  public LOGED_OUT: string = "logedOut";
  public BLOCKED: string = "blocked";
  public REQUEST_ACCEPTED: string = "requestAccepted";
  public REQUEST_DECLINED: string = "requestDeclined";
  public CHANGE: string = "change";
  public NO_CHANGE: string = "no_change";
  public PATTERN: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // public BASE_URL = "http://lawyerupmyrights.com/api/web";
  // public API_BASE_URL = "http://lawyerupmyrights.com/api";

  constructor(public http: HttpClient) { }

  /** user login */
  login(data: LoginRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, data);
  }

  /** Forget passwrod */
  forgetPassword(data: ForgetPasswordRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/forgetPassword`, data);
  }

  /** Reset passwrod */
  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/resetPassword`, data);
  }

  /** User log out */
  logout(data: LogoutRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/logout`, data);
  }

  /** Get user data */
  getUserData(data: GetUserRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/getUser`, data);
  }

  /** Get all users */
  getAllUsers(data: GetAllUsersRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/getAllUsers`, data);
  }

  /** Get blocked users */
  getBlockedUsers(data: GetAllUsersRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/getBlockedUsers`, data);
  }

  /** Block user */
  blockUser(data: BlockUser): Observable<any> {
    return this.http.post(`${this.BASE_URL}/block/user`, data);
  }

  /** Send push notification */
  sendPushNotification(data: SendNotificationRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/sendNotification`, data);
  }

  /** Upload images */
  uploadImages(data: UploadImagesRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/uploadBannerImages`, data);
  }

  /** Get home data */
  getTotalUsersAndProducts(data: GetHomeAdminData): Observable<any> {
    return this.http.post(`${this.BASE_URL}/getTotalUsersAndProducts`, data);
  }
}
