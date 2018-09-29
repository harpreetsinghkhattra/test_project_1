import { Index } from './index';
import { Auth } from '../routes/auth';
import { Operations } from '../operations/operations';
import { CommonJs } from '../operations/common';

const CommonJsInstance = new CommonJs();

export class User {
    socket: any;
    IO: any;
    constructor(socket, io) {
        this.socket = socket;
        this.IO = io;
    }

    userInit() {

        this.getUserProfile();
        this.editSellerProfile();
        this.editUserProfile();
    }

    /** Get profile */
    getUserProfile() {
        this.socket.on('/socket/api/getUser',
            (data: GetUserRequest) => Auth.authUsingSocket('getUser', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    Operations.getUserData(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getUser', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getUser', CommonJs.socketResponse(status, response));
            }));
    }

    /** Edit user profile */
    editUserProfile() {
        this.socket.on('/socket/api/editUserProfile',
            (data: GetUserRequest) => Auth.authUsingSocket('editUserProfile', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    Operations.editUserProfile(data, (status, response) => {
                        this.socket.emit('/socket/api/response/editUserProfile', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/editUserProfile', CommonJs.socketResponse(status, response));
            }));
    }

    /** Edit seller profile */
    editSellerProfile() {
        this.socket.on('/socket/api/editSellerProfile',
            (data: GetUserRequest) => Auth.authUsingSocket('editSellerProfile', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    Operations.editSellerProfile(data, (status, response) => {
                        this.socket.emit('/socket/api/response/editSellerProfile', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/editSellerProfile', CommonJs.socketResponse(status, response));
            }));
    }
}

interface GetUserRequest {
    id: string;
    accessToken: string;
}