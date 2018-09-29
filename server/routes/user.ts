import * as express from 'express';
import { Operations } from '../operations/operations';
import { CommonJs } from '../operations/common';
import { Auth } from './auth';
import { AppKeys } from '../utils/AppKeys';

const router = express.Router();
const CommonJsInstance = new CommonJs();
const AppKeysInstance = new AppKeys();

/** Get user */
router.post('/getUser', (req, res, next) => Auth.userAuth(req, res, next, 'getUser'), (req, res) => {
    Operations.getUserData(req.body, (status, response) => {
        CommonJs.httpResponse(req, res, status, response);
    })
});

/** Edit seller profile */
router.post('/editSellerProfile', (req, res, next) => Auth.userAuth(req, res, next, 'editSellerProfile'), (req, res) => {
    Operations.editSellerProfile(req.body, (status, response) => {
        CommonJs.httpResponse(req, res, status, response)
    });
});

/** Edit user profile */
router.post('/editUserProfile', (req, res, next) => Auth.userAuth(req, res, next, 'editUserProfile'), (req, res) => {
    Operations.editUserProfile(req.body, (status, response) => {
        CommonJs.httpResponse(req, res, status, response)
    });
});

router.post('/sendFriendRequest', (req, res, next) => Auth.userAuth(req, res, next, 'sendFriendRequest'), (req, res) => {
    Operations.sendFriendRequest(req.body, (status, response) => {
        CommonJs.httpResponse(req, res, status, response);
    })
});

router.post('/acceptFriendRequest',
    (req, res, next) => Auth.userAuth(req, res, next, 'acceptFriendRequest'),
    (req, res, next) => {
        Operations.responseFriendRequest(req.body, (status, response) => {
            switch (response && response.result && response.result.nModified ? (parseInt(req.body.status) === AppKeysInstance.ACCEPTED ? response.result.nModified : 2) : 0) {
                case 0:
                    console.log(0);
                    CommonJs.httpResponse(req, res, status, response);
                    break;
                case 1:
                    console.log(1);
                    next();
                    break;
                case 2:
                    console.log(2);
                    CommonJs.httpResponse(req, res, status, response);
                    break;
                default:
                    console.log('default');
                    CommonJs.httpResponse(req, res, status, response);
            }
        })
    }, (req, res, next) => {
        var obj = {
            uid: req.body.uid,
            fid: req.body.fid
        }
        Operations.responseFriendRequestSaveFriends(obj, (status, response) => {
            switch (status) {
                case CommonJsInstance.SUCCESS:
                    next();
                    break;
                default:
                    CommonJs.httpResponse(req, res, status, response);
            }
        })
    }, (req, res) => {
        var obj = {
            uid: req.body.fid,
            fid: req.body.uid
        }
        Operations.responseFriendRequestSaveFriends(obj, (status, response) => {
            CommonJs.httpResponse(req, res, status, response);
        })
    });

router.post('/getFriendsList', (req, res, next) => Auth.userAuth(req, res, next, 'getFriendsList'), (req, res) => {
    Operations.friendsList(req.body, (status, response) => {
        CommonJs.httpResponse(req, res, status, response);
    })
});

module.exports = router;