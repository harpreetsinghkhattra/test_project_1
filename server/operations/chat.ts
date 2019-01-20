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
                const { senderId, receiverId } = obj;

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


    /**
     * Get all chat users
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getAllChatUsers(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var saveMessage = db.collection('saveMessage');
                const { userId } = obj;

                saveMessage.aggregate([
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $eq: ["$sender", new ObjectId(userId)] },
                                    { $eq: ["$receiverId", new ObjectId(userId)] }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            receiver: { $cond: [{ $eq: ["$sender", new ObjectId(userId)] }, "$receiverId", "$senderId"] },
                            message: 1,
                            createdTime: 1,
                            productId: 1
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { receiverId: "$receiver" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$_id", "$$receiverId"] }
                                    }
                                },
                                {
                                    $project: {
                                        _id: "$_id",
                                        name: 1,
                                        imagePath: 1,
                                        imageUrl: 1
                                    }
                                }
                            ],
                            as: "receiverInfo"
                        }
                    },
                    { $unwind: "$receiverInfo" },
                    {
                        $lookup: {
                            from: "products",
                            let: { productId: "$productId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$_id", "$$productId"] }
                                    }
                                },
                                {
                                    $project: {
                                        _id: "$_id",
                                        name: 1,
                                        images: 1
                                    }
                                }
                            ],
                            as: "productInfo"
                        }
                    },
                    { $sort: { "createdTime": -1 } }
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