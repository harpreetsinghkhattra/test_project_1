import * as Nexmo from 'nexmo';

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
}