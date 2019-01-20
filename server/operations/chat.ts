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
                const { senderId, receiverId, productId, message } = obj;

                saveMessage.insert({
                    senderId: new ObjectId(senderId),
                    receiverId: new ObjectId(receiverId),
                    productId: productId ? new ObjectId(productId) : 'NA',
                    message,
                    createdTime: new Date().getTime()
                }, (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else CommonJs.close(client, CommonJSInstance.SUCCESS, data.ops[0], cb);
                });
            }
        });
    }

    /**
     * Get Message
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getAllMessages(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var saveMessage = db.collection('saveMessage');
                const { senderId, receiverId, productId, message } = obj;

                saveMessage.aggregate([
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: ["$senderId", new ObjectId(senderId)] },
                                            { $eq: ["$receiverId", new ObjectId(receiverId)] }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { $eq: ["$senderId", new ObjectId(receiverId)] },
                                            { $eq: ["$receiverId", new ObjectId(senderId)] }
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    { $sort: { "createdTime": -1 } },
                    { $limit: 50 }
                ], (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else data.toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        else CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                    });
                });
            }
        });
    }
}