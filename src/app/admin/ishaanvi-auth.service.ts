import { Injectable } from '@angular/core';
import { CanLoad, Route, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

/** Services */
import { IshaanviApiService } from './ishaanvi-api.service';
import { UserModel } from '../shared/models/user.model';
import { IshaanviSharedataService } from './ishaanvi-sharedata.service';
import { IshaanviAppDataService } from './ishaanvi-app-data.service';
import { ISHAANVI_ADMIN } from '../config/config';

@Injectable({
    providedIn: 'root'
})
export class IshaanviAuthService implements CanActivate {

    public loggedIn: boolean = false;
    constructor(
        public serverService: IshaanviApiService,
        public router: Router,
        public shareData: IshaanviSharedataService,
        public userInfo: IshaanviAppDataService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.loggedIn) return true;
        else this.check(state.url);
    }

    check(url: string) {
        if (this.loggedIn) return true;
        else {
            this.shareData.loaderView('show');
            if (this.userInfo.getUserInfo()._id && this.userInfo.getUserInfo().userType === ISHAANVI_ADMIN) {
                this.shareData.loaderView('hide');
                this.loggedIn = true;
                this.router.navigateByUrl(url);
                return true;
            }

            const userData = this.userInfo.getUserInfoFromLocalStorage();
            if (userData && !userData._id) {
                this.loggedIn = false;
                this.router.navigateByUrl('/login');
                this.shareData.loaderView('hide');
                return false;
            }

            this.serverService.getUserData({
                id: userData._id,
                accessToken: userData.userAccessToken
            })
                .subscribe(res => {
                    const { message, data } = res;
                    switch (message.toLowerCase()) {
                        case this.serverService.SUCCESS.toLowerCase():
                            if (data && data.userType === ISHAANVI_ADMIN) {
                                this.loggedIn = true;
                                this.router.navigateByUrl(url);
                                this.userInfo.setUserInfo(data);
                                return;
                            };

                            this.loggedIn = false;
                            this.router.navigateByUrl('/login');

                            break;
                        default:
                            this.loggedIn = false;
                            this.router.navigateByUrl('/login');
                    }
                }, err => {
                    this.loggedIn = false;
                    this.shareData.loaderView('hide');
                    this.router.navigateByUrl('/login');
                }, () => this.shareData.loaderView('hide'));
        }
    }
}
