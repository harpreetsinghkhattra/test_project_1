import * as Nexmo from 'nexmo';
var AWS = require('aws-sdk');

const NEXMO_API_KEY: string = "884c2702";
const NEXMO_API_SECRET: string = "N7DtgOEZmJuftjg6";

export class SendSMS {

    private nexmo: Nexmo;
    constructor() {
        this.nexmo = new Nexmo({
            apiKey: NEXMO_API_KEY,
            apiSecret: NEXMO_API_SECRET
        }, { debug: true });
    }

    sendMessage(to: string, msg: string, cb) {
        this.nexmo.message.sendSms("918729090566", to, msg, { type: 'unicode' }, cb);
    }

    static sendMessageViaAWS(to: string, msg: string, cb) {
        AWS.config.region = 'eu-west-1';
        
        var param = {
            Message: msg,
            PhoneNumber: to,
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
        publishTextPromise
            .then(function (data) { cb('sent', data) })
            .catch(function (err) { cb('err', err) });
    }
}