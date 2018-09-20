import * as express from 'express';
import { Operations } from '../operations/operations';
import { CommonJs } from '../operations/common';
import { Auth } from './auth';
import * as User from './user';
import { SendSMS } from '../operations/sendSMS';
const Nexmo = require('nexmo');


var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
AWS.config.update({
    accessKeyId: "AKIA35OGV3YLOZQGGRLI",
    secretAccessKey: "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",
});

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

router.post('/resendOTP', (req, res) => {
    CommonJs.validate("resendOTP", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.resendOTP(req.body, (status, response) => {
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

router.get('/sendMessage', (req, res) => {
    if (req.query && req.query.mobile_number) {
        const { mobile_number } = req.query;

        // nexmo.message.sendSms(
        //     "918729090566", '918729090566', 'yo',
        //     (err, responseData) => {
        //         if (err) {
        //             console.log(err);

        //         } else {

        //             console.dir(responseData);

        //         }

        //     }
        // );


        // var sns = new AWS.SNS();
        // var params = {
        //     Message: "your message",
        //     MessageStructure: 'string',
        //     PhoneNumber: mobile_number,
        //     Subject: 'your subject'
        // };

        // sns.publish(params, function (err, data) {
        //     if (err) console.log(err, err.stack); // an error occurred
        //     else console.log(data);           // successful response
        // });

        // Create SMS Attribute parameter you want to get

        var param = {
            Message: 'harpreet singh khattra', /* required */
            PhoneNumber: mobile_number,
            MessageAttributes: {
                'AWS.SNS.SMS.SMSType': {
                    'DataType': "String",
                    "StringValue": "Transactional"
                }
            }
        };

        // Create promise and SNS service object
        var publishTextPromise = new AWS.SNS({ apiVersion: '2012-10-17' })
            .publish(param).promise();

        // Handle promise's fulfilled/rejected states
        publishTextPromise.then(
            function (data) {
                console.log("MessageID is " + data.MessageId);
            }).catch(
            function (err) {
                console.error(err, err.stack);
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