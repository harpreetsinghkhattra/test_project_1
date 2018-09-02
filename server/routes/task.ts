import * as express from 'express';
import { Operations } from '../operations/operations';
import { CommonJs } from '../operations/common';
import { Auth } from './auth';
import * as User from './user';

const router = express.Router();
const CommonJsInstance = new CommonJs();

router.post('/userSignup', (req, res) => {
    CommonJs.validate("userSignup", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.signupUser(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            })
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

router.post('/sellerSignup', (req, res) => {
    CommonJs.validate("sellerSignup", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.signupSeller(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            })
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

router.post('/login', (req, res) => {
    CommonJs.validate("login", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.login(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            })
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

router.post('/forgetPassword', (req, res) => {
    CommonJs.validate("forgetPassword", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.forgetPassword(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            })
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

router.post('/resetPassword', (req, res) => {
    CommonJs.validate("resetPassword", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.resetPassword(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            })
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

router.post('/logout', (req, res) => {
    CommonJs.validate("logout", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.logout(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            })
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

/** User */
router.use('/', User);

module.exports = router;