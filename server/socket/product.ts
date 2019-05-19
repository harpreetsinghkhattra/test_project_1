import { Index } from './index';
import { Auth } from '../routes/auth';
import { Operations } from '../operations/operations';
import { ProductOperations } from '../operations/productOperations';
import { Chat } from '../operations/chat';

import { CommonJs } from '../operations/common';

const CommonJsInstance = new CommonJs();

export class Product {
    socket: any;
    IO: any;
    IndexInstance: Index;
    constructor(socket, io, index) {
        this.socket = socket;
        this.IO = io;
        this.IndexInstance = index;
    }

    userInit() {
        this.addProduct();
        this.editProduct();
        this.getProducts();
        this.getProduct();
        this.getHomeItems();
        this.followUser();
        this.searchProduct();
        this.viewProduct();
        this.addProductCount();
        this.addShopCount();
        this.createComment();
        this.getProductComments();
        this.sendRealTimeP2PMessage();
        this.viewPortal();
        this.getProductsViaType();
        this.rateProduct();
        this.addWishProduct();
        this.removeWishProduct();
        this.clearWishProducts();
        this.getAddedWishProducts();
        this.getMessages();
        this.getChatUsers();
        this.getAllNotifications();
        this.getAddedBannerLocation();
        this.getSurvey();
        this.saveSurvey();
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

    /** Get products */
    getProducts() {
        this.socket.on('/socket/api/getUserProducts',
            (data) => Auth.authUsingSocket('getUserProducts', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.getProducts(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getUserProducts', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getUserProducts', CommonJs.socketResponse(status, response));
            }));
    }

    /** Get product */
    getProduct() {
        this.socket.on('/socket/api/getProduct',
            (data) => Auth.authUsingSocket('getProduct', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.getProduct(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getProduct', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getProduct', CommonJs.socketResponse(status, response));
            }));
    }

    /** Get home items */
    getHomeItems() {
        this.socket.on('/socket/api/getHomeItems',
            (data) => Auth.authUsingSocket('getHomeItems', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    Operations.getHomeItems(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getHomeItems', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getHomeItems', CommonJs.socketResponse(status, response));
            }));
    }

    /** Follow user */
    followUser() {
        this.socket.on('/socket/api/followUser',
            (data) => Auth.authUsingSocket('followUser', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.followUser(data, (status, response) => {
                        this.socket.emit('/socket/api/response/followUser', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/followUser', CommonJs.socketResponse(status, response));
            }));
    }

    /** Product */
    searchProduct() {
        this.socket.on('/socket/api/search',
            (data) => Auth.authUsingSocket('search', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.searchProduct(data, (status, response) => {
                        this.socket.emit('/socket/api/response/search', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/search', CommonJs.socketResponse(status, response));
            }));
    }

    /** View Product */
    viewProduct() {
        this.socket.on('/socket/api/viewProduct',
            (data) => Auth.authUsingSocket('viewProduct', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.getProductViaId(data, (status, response) => {
                        this.socket.emit('/socket/api/response/viewProduct', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/viewProduct', CommonJs.socketResponse(status, response));
            }));
    }

    /** Add product count */
    addProductCount() {
        this.socket.on('/socket/api/addProductCount',
            (data) => Auth.authUsingSocket('addProductCount', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.viewProduct(data, (status, response) => {
                        this.socket.emit('/socket/api/response/addProductCount', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/addProductCount', CommonJs.socketResponse(status, response));
            }));
    }

    /** Add shop count */
    addShopCount() {
        this.socket.on('/socket/api/addShopCount',
            (data) => Auth.authUsingSocket('addShopCount', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.viewShop(data, (status, response) => {
                        this.socket.emit('/socket/api/response/addShopCount', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/addShopCount', CommonJs.socketResponse(status, response));
            }));
    }

    /** Create Comment */
    createComment() {
        this.socket.on('/socket/api/createComment',
            (data) => Auth.authUsingSocket('createComment', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.createCommentForProduct(data, (status, response) => {
                        this.socket.emit('/socket/api/response/createComment', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/createComment', CommonJs.socketResponse(status, response));
            }));
    }

    /** Create Comment */
    getProductComments() {
        this.socket.on('/socket/api/getProductComments',
            (data) => Auth.authUsingSocket('getProductComments', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.getComments(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getProductComments', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getProductComments', CommonJs.socketResponse(status, response));
            }));
    }

    /** Chat */
    sendRealTimeP2PMessage() {
        this.socket.on('/socket/api/sendRealTimeP2PMessage',
            (data) => Auth.authUsingSocket('sendRealTimeP2PMessage', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    Chat.saveMessage(data, (status, response) => {
                        console.log("update user", this.socket.id);
                        console.log("data.senderId", this.IndexInstance.socketIdViaUserId(data.senderId));

                        this.IO.to(this.IndexInstance.socketIdViaUserId(data.senderId)).emit('/socket/api/response/sendRealTimeP2PMessage', CommonJs.socketResponse(status, response));
                        this.IO.to(this.IndexInstance.socketIdViaUserId(data.receiverId)).emit('/socket/api/response/sendRealTimeP2PMessage', CommonJs.socketResponse(status, response));
                    })
                } else this.IO.to(this.IndexInstance.socketIdViaUserId(data.senderId)).emit('/socket/api/response/sendRealTimeP2PMessage', CommonJs.socketResponse(status, response));
            }));
    }

    /** Get products via type */
    getProductsViaType() {
        this.socket.on('/socket/api/getProductViaType',
            (data) => Auth.authUsingSocket('getProductViaType', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.viewProductsViaType(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getProductViaType', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getProductViaType', CommonJs.socketResponse(status, response));
            }));
    }

    /** View portal */
    viewPortal() {
        this.socket.on('/socket/api/viewPortal',
            (data) => Auth.authUsingSocket('viewPortal', data, (status, response) => {
                console.log(status, response);
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.viewPortal(data, (status, response) => {
                        this.socket.emit('/socket/api/response/viewPortal', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/viewPortal', CommonJs.socketResponse(status, response));
            }));
    }

    /** Rate Product */
    rateProduct() {
        this.socket.on('/socket/api/rateProduct',
            (data) => Auth.authUsingSocket('rateProduct', data, (status, response) => {
                console.log(status, response);
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.rateProduct(data, (status, response) => {
                        this.socket.emit('/socket/api/response/rateProduct', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/rateProduct', CommonJs.socketResponse(status, response));
            }));
    }

    /** Add Wish Product */
    addWishProduct() {
        this.socket.on('/socket/api/addWishProduct',
            (data) => Auth.authUsingSocket('addWishProduct', data, (status, response) => {
                console.log(status, response);
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.addWishProduct(data, (status, response) => {
                        this.socket.emit('/socket/api/response/addWishProduct', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/addWishProduct', CommonJs.socketResponse(status, response));
            }));
    }

    /** Clear Wish Products */
    clearWishProducts() {
        this.socket.on('/socket/api/clearWishProducts',
            (data) => Auth.authUsingSocket('clearWishProducts', data, (status, response) => {
                console.log(status, response);
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.clearAllWishedProducts(data, (status, response) => {
                        this.socket.emit('/socket/api/response/clearWishProducts', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/clearWishProducts', CommonJs.socketResponse(status, response));
            }));
    }

    /** Remove Wish Product */
    removeWishProduct() {
        this.socket.on('/socket/api/removeWishProduct',
            (data) => Auth.authUsingSocket('removeWishProduct', data, (status, response) => {
                console.log(status, response);
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.removeWishedProduct(data, (status, response) => {
                        this.socket.emit('/socket/api/response/removeWishProduct', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/removeWishProduct', CommonJs.socketResponse(status, response));
            }));
    }

    /** Get added wish products */
    getAddedWishProducts() {
        this.socket.on('/socket/api/getAddedWishProducts',
            (data) => Auth.authUsingSocket('getAddedWishProducts', data, (status, response) => {
                console.log(status, response);
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.getAddedWishProducts(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getAddedWishProducts', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getAddedWishProducts', CommonJs.socketResponse(status, response));
            }));
    }

    /** Get messages */
    getMessages() {
        this.socket.on('/socket/api/getRealTimeP2PMessage',
            (data) => Auth.authUsingSocket('getRealTimeP2PMessage', data, (status, response) => {
                console.log(status, response);
                if (status === CommonJsInstance.LOGED_IN) {
                    Chat.getAllMessages(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getRealTimeP2PMessage', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getRealTimeP2PMessage', CommonJs.socketResponse(status, response));
            }));
    }

    /** Get Chat Users */
    getChatUsers() {
        this.socket.on('/socket/api/getAllChatUsers',
            (data) => Auth.authUsingSocket('getAllChatUsers', data, (status, response) => {
                console.log(status, response);
                if (status === CommonJsInstance.LOGED_IN) {
                    Chat.getAllChatUsers(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getAllChatUsers', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getAllChatUsers', CommonJs.socketResponse(status, response));
            }));
    }

    /** Get All Notifications */
    getAllNotifications() {
        this.socket.on('/socket/api/getAllNotifications',
            (data) => Auth.authUsingSocket('getAllNotifications', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    Operations.getAllNotifications(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getAllNotifications', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getAllNotifications', CommonJs.socketResponse(status, response));
            }));
    }

    /** Get All added banneres */
    getAddedBannerLocation() {
        this.socket.on('/socket/api/getAddedBannerLocation',
            (data) => Auth.authUsingSocket('getAddedBannerLocation', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.getAddedBanners(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getAddedBannerLocation', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getAddedBannerLocation', CommonJs.socketResponse(status, response));
            }));
    }

    /** Get survey */
    getSurvey() {
        this.socket.on('/socket/api/getSurvey',
            (data) => Auth.authUsingSocket('getSurvey', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.getSurvey(data, (status, response) => {
                        this.socket.emit('/socket/api/response/getSurvey', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/getSurvey', CommonJs.socketResponse(status, response));
            }));
    }

    /** Save survey */
    saveSurvey() {
        this.socket.on('/socket/api/saveSurvey',
            (data) => Auth.authUsingSocket('saveSurvey', data, (status, response) => {
                if (status === CommonJsInstance.LOGED_IN) {
                    ProductOperations.saveSurvey(data, (status, response) => {
                        this.socket.emit('/socket/api/response/saveSurvey', CommonJs.socketResponse(status, response));
                    })
                } else this.socket.emit('/socket/api/response/saveSurvey', CommonJs.socketResponse(status, response));
            }));
    }
}

interface GetUserRequest {
    id: string;
    accessToken: string;
}

// {
// 	"id": "5bd5d1bdd1d7fcf5fd4708a9",
//     "accessToken": "00c6da5c257b6efa5a27aa5e9350a79d",
//   	"receiverId": "5bd5d1b8d1d7fcf5fd4708a7",
//   	"senderId": "5bd5d1bdd1d7fcf5fd4708a9",
//   	"message": "need to amend as peer"
// }