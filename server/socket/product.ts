import { Index } from './index';
import { Auth } from '../routes/auth';
import { Operations } from '../operations/operations';
import { ProductOperations } from '../operations/productOperations';

import { CommonJs } from '../operations/common';

const CommonJsInstance = new CommonJs();

export class Product {
    socket: any;
    IO: any;
    constructor(socket, io) {
        this.socket = socket;
        this.IO = io;
    }

    userInit() {
        this.addProduct();
        this.editProduct();
    }

    /** Add product */
    addProduct() {
        this.socket.on('/socket/api/addProduct',
            (data: GetUserRequest) => Auth.authUsingSocket('addProduct', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.addProduct(data, (status, response) => {
                        this.socket.emit('/socket/api/response/addProduct', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/addProduct', CommonJs.socketResponse(status, response));
            }));
    }

    /** Edit product */
    editProduct() {
        this.socket.on('/socket/api/editProduct',
            (data: GetUserRequest) => Auth.authUsingSocket('editProduct', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.editProduct(data, (status, response) => {
                        this.socket.emit('/socket/api/response/editProduct', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/editProduct', CommonJs.socketResponse(status, response));
            }));
    }
}

interface GetUserRequest {
    id: string;
    accessToken: string;
}