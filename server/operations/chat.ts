import { Connection } from './connection';
import { CommonJs } from './common';
import { ObjectId, ObjectID } from 'mongodb';
import { SendMail } from './sendMail';
import { AppKeys } from '../utils/AppKeys';
import { SendSMS } from './sendSMS';
const CommonJSInstance = new CommonJs();
const AppKeysInstance = new AppKeys();

export class Chat {

    /**
     * Save Message
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static saveMessage(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var saveMessage = db.collection('saveMessage');
                const { senderId, receiverId, message } = obj;

                saveMessage.insert({
                    productId: new ObjectId(senderId),
                    userId: new ObjectId(receiverId),
                    message,
                    createdTime: new Date().getTime()
                }, (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else CommonJs.close(client, CommonJSInstance.SUCCESS, data.ops[0], cb);
                });
            }
        });
    }
}