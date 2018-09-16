import * as express from 'express';
import { Operations } from '../operations/operations';
import { CommonJs } from '../operations/common';
import { Auth } from './auth';
import * as User from './user';
import { SendSMS } from '../operations/sendSMS';
const Nexmo = require('nexmo');

const router = express.Router();
const CommonJsInstance = new CommonJs();
const sendSMS = new SendSMS();
const NEXMO_API_KEY = "884c2702";
const NEXMO_API_SECRET = "N7DtgOEZmJuftjg6";
const nexmo = new Nexmo({
    apiKey: NEXMO_API_KEY,
    apiSecret: NEXMO_API_SECRET
});

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

/** Verification */
router.post('/verification', (req, res) => {
    CommonJs.validate("verification", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.verification(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            });
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

router.get('/isValidNumber', (req, res) => {
    if (req.query && req.query.mobile_number) {
        const { mobile_number } = req.query;
        nexmo.numberInsight.get({ level: 'basic', number: mobile_number }, (err, response) => {
            if (err) CommonJs.httpResponse(req, res, CommonJsInstance.ERROR, err);
            else {
                if (response.status === 0) CommonJs.httpResponse(req, res, CommonJsInstance.SUCCESS, response);
                else CommonJs.httpResponse(req, res, CommonJsInstance.NOT_VALID, response);
            }
        });
    } else CommonJs.httpResponse(req, res, CommonJsInstance.NOT_VALID, []);
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