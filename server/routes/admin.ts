import * as express from 'express';
import { AdminOperations } from '../operations/adminOperations';
import { CommonJs } from '../operations/common';
import { Auth } from './auth';

const router = express.Router();
const CommonJsInstance = new CommonJs();

/** Block user */
router.post('/block/user', (req, res, next) => Auth.userAuth(req, res, next, 'blockUser'), (req, res) => {
    AdminOperations.blockUser(req.body, (status, response) => {
        CommonJs.httpResponse(req, res, status, response);
    })
});

/** Get all users */
router.post('/getAllUsers', (req, res, next) => Auth.userAuth(req, res, next, 'getAllUsers'), (req, res) => {
    AdminOperations.getAllUsers(req.body, (status, response) => {
        CommonJs.httpResponse(req, res, status, response);
    })
});

/** Get blocked users */
router.post('/getBlockedUsers', (req, res, next) => Auth.userAuth(req, res, next, 'getBlockedUsers'), (req, res) => {
    AdminOperations.getBlockedUsers(req.body, (status, response) => {
        CommonJs.httpResponse(req, res, status, response);
    })
});

/** Get all users count and all products count */
router.post('/getTotalUsersAndProducts', (req, res, next) => Auth.userAuth(req, res, next, 'getTotalUsersAndProducts'), (req, res) => {
    AdminOperations.getAdminHomeData(req.body, (status, response) => {
        CommonJs.httpResponse(req, res, status, response);
    })
});

module.exports = router;