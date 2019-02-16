import { Connection } from './connection';
import { CommonJs } from './common';
import { ObjectId, ObjectID } from 'mongodb';
import { SendMail } from './sendMail';
import { AppKeys } from '../utils/AppKeys';
import { SendSMS } from './sendSMS';

const CommonJSInstance = new CommonJs();
const AppKeysInstance = new AppKeys();
var FCM = require('fcm-node')
var serverKey = require('../ishaanvi-1adfe-firebase-adminsdk-29s1y-43891fe706.json') //put the generated private key path here    
var fcm = new FCM(serverKey)

export class Operations {

    /**
     * Login of user
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static login(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                collection.find({ email: obj.email.toLowerCase(), deletedStatus: 0 }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        obj.salt = data[0].salt ? data[0].salt : 'any';
                        CommonJs.randomPassword(obj.salt, obj.password, (password, salt) => {
                            collection.find({ email: obj.email.toLowerCase(), password: password }, { projection: { password: 0, salt: 0 } }).toArray((err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                else if (data && data.length !== 0) {
                                    if (data[0] && (data[0].verificationCode === 1 || data[0].userType === 2)) {
                                        CommonJs.close(client, CommonJSInstance.SUCCESS, data[0], cb);
                                    } else {
                                        this.getCollectionData({ email: obj.email.toLowerCase() }, collection, { projection: { password: 0, salt: 0, userAccessToken: 0, _id: 0 } }, client, cb);
                                    }
                                } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                            })
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        })
    }

    /**
     * Signup user
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static signupUser(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                CommonJs.randomPassword(obj.email.toLowerCase(), obj.password, (password, salt) => {
                    collection.find({ email: obj.email.toLowerCase() }).toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        if (data && data.length === 0) {
                            CommonJs.generateToken(obj.email.toLowerCase(), (TOKEN, salt) => {
                                if (TOKEN) {
                                    collection.insert({
                                        email: obj.email.toLowerCase(),
                                        password: password,
                                        userType: 2,
                                        mobile_number: obj.mobile_number,
                                        termsAndConditions: obj.terms_and_conditions,
                                        status: 0,
                                        deletedStatus: 0,
                                        userAccessToken: TOKEN,
                                        salt: salt,
                                        createdTime: new Date().getTime(),
                                        updatedTime: new Date().getTime()
                                    }, (err, data) => {
                                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                        else {
                                            // var response = data.ops[0];
                                            this.getCollectionData({ email: obj.email.toLowerCase() }, collection, { projection: { password: 0, salt: 0 } }, client, cb);
                                        }
                                    });
                                } else CommonJs.close(client, CommonJSInstance.TOKEN_ERROR, [], cb);
                            });
                        } else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                    })
                })
            }
        })
    }

    /**
     * Seller signup user
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static signupSeller(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');

                CommonJs.randomPassword(obj.email.toLowerCase(), obj.password, (password, salt) => {
                    collection.find({ email: obj.email.toLowerCase() }).toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        if (data && data.length === 0) {
                            CommonJs.generateToken(obj.email.toLowerCase(), (TOKEN, salt) => {
                                if (TOKEN) {
                                    collection.insert({
                                        email: obj.email.toLowerCase(),
                                        password: password,
                                        userType: 1,
                                        name: obj.name,
                                        category: obj.category,
                                        business_name: obj.business_name,
                                        mobile_number: obj.mobile_number,
                                        address: obj.address,
                                        location: obj.location,
                                        business_address: obj.business_address,
                                        status: 0,
                                        deletedStatus: 0,
                                        userAccessToken: TOKEN,
                                        salt: salt,
                                        createdTime: CommonJSInstance.EPOCH_TIME,
                                        updatedTime: CommonJSInstance.EPOCH_TIME
                                    }, (err, data) => {
                                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                        else {

                                            //Create random password key
                                            var randomeToken = Math.floor(Math.random() * 1000000) + '';
                                            randomeToken = randomeToken.length === 6 ? randomeToken : randomeToken + randomeToken.substr(0, 6 - randomeToken.length);
                                            console.log(randomeToken);
                                            CommonJs.randomPassword(obj.email.toLowerCase(), randomeToken, (token, salt) => {
                                                var message = `ISHAANVI verification code: ${randomeToken}`
                                                var mailSentOpt = {
                                                    email: obj.email.toLowerCase(),
                                                    token: randomeToken
                                                }

                                                collection.update({ email: obj.email.toLowerCase() }, {
                                                    $set: {
                                                        verificationToken: token,
                                                        verificationCode: 0,
                                                        updatedTime: new Date().getTime()
                                                    }
                                                }, (err, data) => {
                                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                                                    else SendSMS.sendMessageViaAWS("91" + obj.mobile_number, message, (status, res) => {
                                                        console.log(status, res);
                                                        // this.getCollectionData({ email: obj.email.toLowerCase() }, collection, { projection: { password: 0, salt: 0 } }, client, cb)
                                                        SendMail.signupSuccess(mailSentOpt, (status, res) => this.getCollectionData({ email: obj.email.toLowerCase() }, collection, { projection: { password: 0, salt: 0 } }, client, cb));
                                                    });
                                                    // SendMail.signupSuccess(mailSentOpt, (status, res) => this.getCollectionData({ email: obj.email.toLowerCase() }, collection, { projection: { password: 0, salt: 0 } }, client, cb));
                                                });
                                            });
                                        }
                                    });
                                } else CommonJs.close(client, CommonJSInstance.TOKEN_ERROR, [], cb);
                            });
                        } else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                    })
                })
            }
        })
    }

    /**
     * Login via facebook or google
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static loginViaFBOrGoogle(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');

                collection.find({ email: obj.email.toLowerCase() }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length === 0) {
                        CommonJs.generateToken(obj.email.toLowerCase(), (TOKEN, salt) => {
                            if (TOKEN) {
                                collection.insert({
                                    email: obj.email.toLowerCase(),
                                    userType: 2,
                                    socialMediauser: 1,
                                    imageUrl: obj.imageUrl,
                                    userId: obj.userId,
                                    name: obj.name,
                                    status: 0,
                                    deletedStatus: 0,
                                    userAccessToken: TOKEN,
                                    salt: salt,
                                    createdTime: CommonJSInstance.EPOCH_TIME,
                                    updatedTime: CommonJSInstance.EPOCH_TIME
                                }, (err, data) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    else {
                                        this.getCollectionData({ email: obj.email.toLowerCase() }, collection, { projection: { salt: 0 } }, client, cb);
                                    }
                                });
                            } else CommonJs.close(client, CommonJSInstance.TOKEN_ERROR, [], cb);
                        });
                    } else this.getCollectionData({ email: obj.email.toLowerCase() }, collection, { projection: { salt: 0 } }, client, cb);
                })
            }
        })
    }

    /**
     * Resend otp
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static resendOTP(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');

                collection.find({ email: obj.email.toLowerCase() }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length !== 0) {
                        //Create random password key
                        var randomeToken = Math.floor(Math.random() * 1000000) + '';
                        randomeToken = randomeToken.length === 6 ? randomeToken : randomeToken + randomeToken.substr(0, 6 - randomeToken.length);
                        console.log(randomeToken);
                        CommonJs.randomPassword(obj.email.toLowerCase(), randomeToken, (token, salt) => {
                            var message = `ISHAANVI verification code: ${randomeToken}`
                            var mailSentOpt = {
                                email: obj.email.toLowerCase(),
                                token: randomeToken
                            }

                            collection.update({ email: obj.email.toLowerCase() }, {
                                $set: {
                                    verificationToken: token,
                                    verificationCode: 0,
                                    updatedTime: new Date().getTime()
                                }
                            }, (err, d) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                                else SendSMS.sendMessageViaAWS("91" + data[0].mobile_number, message, (status, res) => {
                                    console.log(status, res);
                                    this.getCollectionData({ email: obj.email.toLowerCase() }, collection, { projection: { password: 0, salt: 0 } }, client, cb)
                                });
                                // else SendMail.signupSuccess(mailSentOpt, (status, res) => this.getCollectionData({ email: obj.email.toLowerCase() }, collection, { projection: { password: 0, salt: 0 } }, client, cb));
                            });
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                })
            }
        })
    }

    /**
     * Get collection data
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getCollectionData(obj, collection, excludeVal, client, cb) {
        collection.find(obj, excludeVal).toArray((err, data) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.SUCCESS, data[0], cb);
            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
        });
    }

    /**
     * Get user data
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getUserData(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                collection.find({ _id: ObjectId(obj.id), deletedStatus: 0 }, { projection: { password: 0, salt: 0, userAccessToken: 0 } }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.SUCCESS, data[0], cb);
                    else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                })
            }
        })
    }

    /**
     * Send notification
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static sendNotification(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('notifications');
                const { title, description } = obj;

                collection.insertOne({
                    title,
                    description,
                    createdTime: new Date().getTime(),
                    updatedTime: new Date().getTime()
                }, (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else {
                        const message = {
                            to: "/topics/ishaanvi_events",
                            notification: {
                                title,
                                body: description,
                                sound: "default",
                                color: '#59CAC8'
                            },
                            "data": {
                                title,
                                description
                            }
                        };

                        fcm.send(message, function (err, response) {
                            if (err) {
                                CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            } else {
                                CommonJs.close(client, CommonJSInstance.SUCCESS, response, cb);
                            }
                        });
                    }
                })
            }
        })
    }

    /**
     * Get Notifications
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getAllNotifications(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('notifications');
                const { createdTime } = obj;

                collection.find({ createdTime: { $gte: createdTime } }).sort({ createdTime: -1 }).limit(100).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                })
            }
        })
    }

    /**
     * Friend request
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static sendFriendRequest(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var friendRequest = db.collection('friendRequests');

                friendRequest.find({ uid: new ObjectId(obj.uid), fid: new ObjectId(obj.fid) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length === 0) {
                        friendRequest.insert({
                            uid: new ObjectId(obj.uid),
                            fid: new ObjectId(obj.fid),
                            status: AppKeysInstance.AWAITING,
                            createdTime: CommonJSInstance.EPOCH_TIME,
                            updatedTime: CommonJSInstance.EPOCH_TIME
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                })
            }
        })
    }

    /**
     * Friend request accept/decline
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static responseFriendRequest(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var friendRequest = db.collection('friendRequests');

                friendRequest.find({ _id: new ObjectId(obj.request_id), status: AppKeysInstance.AWAITING }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length !== 0) {
                        friendRequest.update({ _id: new ObjectId(obj.request_id), status: AppKeysInstance.AWAITING }, {
                            $set: {
                                status: obj.status,
                                updatedTime: CommonJSInstance.EPOCH_TIME
                            }
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else CommonJs.close(client, obj.status === AppKeysInstance.ACCEPTED ? CommonJSInstance.REQUEST_ACCEPTED : CommonJSInstance.REQUEST_DECLINED, data, cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                })
            }
        })
    }

    /**
     * Friend request accept/decline save friends in collection
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static responseFriendRequestSaveFriends(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var friends = db.collection('friends');

                friends.find({ uid: new ObjectId(obj.uid) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length !== 0) {
                        friends.update({ uid: new ObjectId(obj.uid), "friends.id": { $ne: new ObjectId(obj.fid) } }, {
                            $addToSet: {
                                friends: {
                                    id: new ObjectId(obj.fid),
                                    createdTime: CommonJSInstance.EPOCH_TIME
                                }
                            }
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                        });
                    } else friends.insert({
                        uid: new ObjectId(obj.uid),
                        friends: [{
                            id: new ObjectId(obj.fid),
                            createdTime: CommonJSInstance.EPOCH_TIME
                        }]
                    }, (err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        else CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                    });
                })
            }
        })
    }

    /**
     * Get friends list with friends info
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static friendsList(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var friends = db.collection('friends');

                friends.aggregate([
                    { $match: { _id: new ObjectId("5b5a3e10b3a80c0d7c62a0bc") } },
                    { $unwind: "$friends" },
                    {
                        $lookup: {
                            "from": "users",
                            "foreignField": "_id",
                            "localField": "friends.id",
                            "as": "info"
                        }
                    },
                    { $unwind: "$info" },
                    {
                        $project: {
                            "_id": 0,
                            "uid": 1,
                            "info._id": 1,
                            "info.email": 1,
                            "info.firstName": 1,
                            "info.lastName": 1,
                            "info.status": 1,
                            "info.deletedStatus": 1,
                            "info.createdTime": 1,
                            "info.updatedTime": 1
                        }
                    },
                    {
                        $group: {
                            "_id": 0,
                            "uid": { $first: "$uid" },
                            "info": { $push: "$info" }
                        }
                    }
                ], (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else data.toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        else CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                    });
                });
            }
        })
    }

    /**
     * Forget password
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static forgetPassword(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                collection.find({ email: obj.email.toLowerCase(), deletedStatus: 0, socialMediauser: { $ne: 1 } }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {

                        //Create random password key
                        obj.password = Math.floor(Math.random() * 1000000) + '';
                        console.log("Password = ", obj.password);

                        CommonJs.randomPassword(obj.email.toLowerCase(), obj.password, (password, salt) => {
                            collection.updateOne({ email: obj.email.toLowerCase() }, {
                                $set: {
                                    password: password,
                                    forgetPassword: 1,
                                    updatedTime: new Date().getTime()
                                }
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                else {
                                    SendMail.forgetPassword(obj, (status, response) => CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb));
                                }
                            });
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                });
            }
        })
    }

    /**
     * Get list of items in home page
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getHomeItems(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                let { category, area, presentShops, coordinates } = obj;
                presentShops = presentShops && presentShops.length ? presentShops.map(ele => new ObjectId(ele)) : [];

                users.aggregate([
                    {
                        $geoNear: {
                            near: { coordinates },
                            distanceField: "shopLocation",
                            distanceMultiplier: 1 / 1000,
                            spherical: true
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            itemCode: 1,
                            userId: 1,
                            shopLocation: 1,
                            business_name: 1,
                            name: 1,
                            business_address: 1,
                            mobile_number: 1,
                            isShown: {
                                $and: [
                                    { $ne: [{ $indexOfArray: [presentShops, "$_id"] }, -1] }
                                ]
                            }
                        }
                    },
                    { $match: { isShown: false } },
                    {
                        $lookup: {
                            "from": "products",
                            "let": { idd: "$_id" },
                            "pipeline": [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $and:
                                            category === 'all' ?
                                                [
                                                    { $eq: ["$userId", "$$idd"] },
                                                ]
                                                :
                                                [
                                                    { $eq: ["$userId", "$$idd"] },
                                                    { $ne: [{ $indexOfArray: [category, "$category"] }, -1] }
                                                ]
                                        }
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "productsRatings",
                                        let: { id: "$_id" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $and: [
                                                            { $eq: ["$$id", "$productId"] }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                $addFields: {
                                                    rating: { $convert: { input: "$rating", to: "double", onNull: null } },
                                                }
                                            },
                                        ],
                                        as: 'rating'
                                    }
                                },
                                {
                                    $addFields: {
                                        reviews: { $size: "$rating" },
                                        rating: { $avg: "$rating.rating" }
                                    }
                                },
                                { $sort: { createdTime: -1 } },
                                { $limit: 6 }
                            ],
                            "as": "items"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            itemCode: 1,
                            userId: 1,
                            shopLocation: 1,
                            business_name: 1,
                            name: 1,
                            business_address: 1,
                            mobile_number: 1, 
                            itemsCount: { "$size": { "$ifNull": ["$items", []] } }
                        }
                    },
                    { $sort: { itemsCount: -1 } },
                    { $match: { itemsCount: { $gte: 1 }, shopLocation: { $lte: parseInt(area) } } },
                    { $limit: 6 },
                    { $sample: { size: 6 } }
                ], (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else data.toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        else CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                    });
                });
            }
        })
    }


    /**
     * Reset password
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static resetPassword(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                collection.find({ email: obj.email.toLowerCase(), deletedStatus: 0 }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {

                        CommonJs.randomPassword(obj.email.toLowerCase(), obj.password, (password, salt) => {
                            collection.updateOne({ email: obj.email.toLowerCase() }, {
                                $set: {
                                    password: password,
                                    forgetPassword: 0,
                                    updatedTime: new Date().getTime()
                                }
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                else {
                                    this.getCollectionData({ email: obj.email.toLowerCase() }, collection, { projection: { password: 0, salt: 0 } }, client, cb);
                                }
                            });
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                });
            }
        })
    }

    /**
     * Verification
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static verification(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');

                CommonJs.randomPassword(obj.email.toLowerCase(), obj.token, (token, salt) => {
                    collection.find({ email: obj.email.toLowerCase(), verificationCode: 0, verificationToken: token }).toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        if (data && data.length !== 0) {
                            collection.update({ email: obj.email.toLowerCase(), verificationCode: 0, verificationToken: token }, {
                                $set: {
                                    verificationCode: 1,
                                    verificationToken: null,
                                    updatedTime: new Date().getTime()
                                }
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                                else this.getCollectionData({ email: obj.email.toLowerCase() }, collection, { projection: { password: 0, salt: 0 } }, client, cb);
                            })
                        } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                    })
                });
            }
        })
    }

    /**
     * Edit seller profile 
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static editSellerProfile(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                this.isEmailPresentInAnotherAccountsExceptCurrentOneSellerUser(obj.id, obj.email, obj.mobile_number, (status) => {
                    console.log("status ====================> ", status);
                    if (status === CommonJSInstance.NO_CHANGE) {
                        users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                users.update({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }, {
                                    $set: {
                                        name: obj.name,
                                        email: obj.email.toLowerCase(),
                                        category: obj.category,
                                        business_name: obj.business_name,
                                        address: obj.address,
                                        location: obj.location,
                                        business_address: obj.business_address,
                                        updatedTime: CommonJSInstance.EPOCH_TIME
                                    }
                                }, (err, data) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                                    else this.getCollectionData({ email: obj.email.toLowerCase() }, users, { projection: { password: 0, salt: 0 } }, client, cb);
                                });
                            } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                        });
                    } else if (status === CommonJSInstance.EMAIL_PRESENT) CommonJs.close(client, CommonJSInstance.EMAIL_PRESENT, [], cb);
                    else if (status === CommonJSInstance.CHANGE) {
                        users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                users.update({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }, {
                                    $set: {
                                        email: obj.email.toLowerCase(),
                                        name: obj.name,
                                        category: obj.category,
                                        business_name: obj.business_name,
                                        mobile_number: obj.mobile_number,
                                        address: obj.address,
                                        location: obj.location,
                                        business_address: obj.business_address,
                                        updatedTime: CommonJSInstance.EPOCH_TIME
                                    }
                                }, (err, data) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    else {
                                        //Create random password key
                                        var randomeToken = Math.floor(Math.random() * 1000000) + '';
                                        randomeToken = randomeToken.length === 6 ? randomeToken : randomeToken + randomeToken.substr(0, 6 - randomeToken.length);

                                        CommonJs.randomPassword(obj.email.toLowerCase(), randomeToken, (token, salt) => {
                                            var mailSentOpt = {
                                                email: obj.email,
                                                token: randomeToken
                                            }

                                            users.update({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken, email: obj.email.toLowerCase() }, {
                                                $set: {
                                                    verificationToken: token,
                                                    verificationCode: 0,
                                                    updatedTime: new Date().getTime()
                                                }
                                            }, (err, data) => {
                                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                                                else SendMail.emailVerificationWhileChanginEmail(mailSentOpt, (status, res) => CommonJs.close(client, CommonJSInstance.SUCCESS_WITH_MOBILE_CHANGE, [], cb));
                                            });
                                        });
                                    }
                                });
                            } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                        });
                    }
                });
            }
        });
    }

    /**
     * Edit user profile 
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static editUserProfile(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                this.isEmailPresentInAnotherAccountsExceptCurrentOne(obj.id, obj.email, obj.mobile_number, (status) => {
                    if (status === CommonJSInstance.NO_CHANGE || status === CommonJSInstance.CHANGE) {
                        users.update({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }, {
                            $set: {
                                email: obj.email.toLowerCase(),
                                mobile_number: obj.mobile_number,
                                location: obj.location,
                                address: obj.address,
                                name: obj.name,
                                updatedTime: CommonJSInstance.EPOCH_TIME
                            }
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                            else this.getCollectionData({ email: obj.email.toLowerCase() }, users, { projection: { password: 0, salt: 0 } }, client, cb);
                        });
                    } else if (status === CommonJSInstance.EMAIL_PRESENT) CommonJs.close(client, CommonJSInstance.EMAIL_PRESENT, [], cb);
                    else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                });
            }
        });
    }

    /**
     * Edit profile image
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static editProfileImage(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                users.update({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }, {
                    $set: {
                        imageUrl: obj.imagePath,
                        updatedTime: CommonJSInstance.EPOCH_TIME
                    }
                }, (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                    else this.getCollectionData({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }, users, { projection: { password: 0, salt: 0 } }, client, cb);
                });
            }
        });
    }

    /**
     * Only check for edit user profile
     */
    static isEmailPresentInAnotherAccountsExceptCurrentOne(id, email, mobile_number, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');

                // Check in users
                users.find({ _id: new ObjectId(id), email: email.toLowerCase() }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) cb(CommonJSInstance.NO_CHANGE);
                    else {
                        users.find({ email: email.toLowerCase(), _id: { $ne: new ObjectId(id) } }).toArray((err, data) => {
                            console.log(data);
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) cb(CommonJSInstance.EMAIL_PRESENT);
                            else cb(CommonJSInstance.NO_CHANGE);
                        });
                    }
                });
            }
        })
    }

    /**
     * Only check for edit user profile
     */
    static isEmailPresentInAnotherAccountsExceptCurrentOneSellerUser(id, email, mobile_number, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');

                // Check in users
                users.find({ _id: new ObjectId(id), email: email.toLowerCase(), mobile_number }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) cb(CommonJSInstance.NO_CHANGE);
                    else {
                        users.find({ email: email.toLowerCase(), _id: { $ne: new ObjectId(id) } }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) cb(CommonJSInstance.EMAIL_PRESENT);
                            else users.find({ _id: new ObjectId(id), mobile_number }).toArray((err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                if (data && data.length !== 0) cb(CommonJSInstance.NO_CHANGE);
                                else cb(CommonJSInstance.CHANGE);
                            });
                        });
                    }
                });
            }
        })
    }

    /**
     * Logout of user
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static logout(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                collection.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        CommonJs.generateToken(obj.id.toLowerCase(), (TOKEN, salt) => {
                            if (TOKEN) {
                                collection.update({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }, {
                                    $set: {
                                        userAccessToken: TOKEN,
                                        updatedTime: new Date().getTime()
                                    }
                                }, (err, success) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    else this.getCollectionData({ _id: new ObjectId(obj.id) }, collection, { projection: { password: 0, salt: 0 } }, client, cb);
                                });
                            } else CommonJs.close(client, CommonJSInstance.TOKEN_ERROR, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                })
            }
        })
    }

    /**
     * Is user logged in
     */
    static isUserLoggedIn(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');

                users.find({ _id: new ObjectId(obj.id) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken, deletedStatus: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.LOGED_IN, [], cb);
                            else CommonJs.close(client, CommonJSInstance.LOGED_OUT, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }
}














// db.getCollection('users').aggregate([
//     {
//         $project: {
//             _id: 1,
//             itemCode: 1,
//             userId: 1,
//             isShown: { $ne: [ { $indexOfArray: [ [ ], "$_id"] }, -1 ] }
//         }
//     },
//     { $match: { isShown: false }},
//     { $sample: { size: 6 } },
//     {
//         $lookup: {
//             "from": "products",
//             "let": { idd: "$_id" },
//             "pipeline": [
//                 {$match: 
//                     { $expr:
//                         { $and:
//                            [
//                              { $eq: [ "$userId",  "$$idd" ] }
//                            ]
//                         }
//                      }
//                  },
//                  {$sort: {createdTime: -1}},
//                  {$limit: 6}
//             ],
//             "as": "items"
//         }
//     }, 
//     { $sort : { age : -1, posts: 1 } }
// ]);


// db.getCollection('users').aggregate([
//     {
//         $project: {
//             _id: 1,
//             itemCode: 1,
//             userId: 1,
//             isShown: { $or: [{$ne: [ { $indexOfArray: [ [ ], "$_id"] }, -1 ]}, {$lt: [100, 99]}] }
//         }
//     },
//     { $match: { isShown: false }},
//     { $sample: { size: 6 } },
//     {
//         $lookup: {
//             "from": "products",
//             "let": { idd: "$_id" },
//             "pipeline": [
//                 {$match: 
//                     { $expr:
//                         { $and:
//                            [
//                              { $eq: [ "$userId",  "$$idd" ] },
//                              { $eq: [ "$category",  "clothes" ] }
//                            ]
//                         }
//                      }
//                  },
//                  {$sort: {createdTime: -1}},
//                  {$limit: 6}
//             ],
//             "as": "items"
//         }
//     }, 
//     { $sort : { age : -1, posts: 1 } }
// ]);




// db.getCollection('users').aggregate([
//     {
//         $project: {
//             _id: 1,
//             itemCode: 1,
//             userId: 1,
//             isShown: { $or: [{$ne: [ { $indexOfArray: [ [ ], "$_id"] }, -1 ]}, {$lt: [100, 99]}] }
//         }
//     },
//     { $match: { isShown: false }},
//     {
//         $lookup: {
//             "from": "products",
//             "let": { idd: "$_id" },
//             "pipeline": [
//                 {$match: 
//                     { $expr:
//                         { $and:
//                            [
//                              { $eq: [ "$userId",  "$$idd" ] },
//                              { $eq: [ "$category",  "suits" ] }
//                            ]
//                         }
//                      }
//                  },
//                  {$sort: {createdTime: -1}},
//                  {$limit: 6}
//             ],
//             "as": "items"
//         }
//     }, 
//     {
//         $project:{
//             _id: 1,
//             items: 1,
//             itemsCount: { "$size": { "$ifNull": ["$items", []] } }
//         }
//     },
//     { $sort : {  itemsCount: -1 } },
//     { $match: { itemsCount: { $gte: 1 } }},
//     { $limit: 6 },
//     { $sample: { size: 6 } }
// ]);

// db.getCollection('users').createIndex( { "location": "2dsphere" } );


// db.getCollection('users').aggregate([
//     {
//         $geoNear: {
//             near: { coordinates: [ 30.6184854, 76.3649714 ] },
//             distanceField: "calculated",
//             distanceMultiplier	: 1/1000,
//             spherical: true
//         }
//     },
//     {
//         $project: {
//             _id: 1,
//             itemCode: 1,
//             userId: 1,
//             calculated: 1,
//             isShown: { 
//                 $and: [
//                     {$ne: [ { $indexOfArray: [ [ ], "$_id"] }, -1 ]}
//                 ] 
//             }
//         }
//     },
//     { $match: { isShown: false }},
//     {
//         $lookup: {
//             "from": "products",
//             "let": { idd: "$_id" },
//             "pipeline": [
//                 {$match: 
//                     { $expr:
//                         { $and:
//                            [
//                              { $eq: [ "$userId",  "$$idd" ] },
//                              { $eq: [ "$category",  "suits" ] }
//                            ]
//                         }
//                      }
//                  },
//                  {$sort: {createdTime: -1}},
//                  {$limit: 6}
//             ],
//             "as": "items"
//         }
//     }, 
//     {
//         $project:{
//             _id: 1,
//             items: 1,
//             calculated: 1,
//             itemsCount: { "$size": { "$ifNull": ["$items", []] } }
//         }
//     },
//     { $sort : {  itemsCount: -1 } },
//     { $match: { itemsCount: { $gte: 1 } }},
//     { $limit: 6 },
//     { $sample: { size: 6 } }
// ]);

// db.getCollection('users').aggregate([
//     {
//         $geoNear: {
//             near: { coordinates: [ 30.6184854, 76.3649714 ] },
//             distanceField: "shopLocation",
//             distanceMultiplier	: 1/1000,
//             spherical: true
//         }
//     },
//     {
//         $project: {
//             _id: 1,
//             itemCode: 1,
//             userId: 1,
//             shopLocation: 1,
//             isShown: { 
//                 $and: [
//                     {$ne: [ { $indexOfArray: [ [ ], "$_id"] }, -1 ]}
//                 ] 
//             }
//         }
//     },
//     { $match: { isShown: false }},
//     {
//         $lookup: {
//             "from": "products",
//             "let": { idd: "$_id" },
//             "pipeline": [
//                 {$match: 
//                     { $expr:
//                         { $and:
//                            [
//                              { $eq: [ "$userId",  "$$idd" ] },
//                              { $eq: [ "$category",  "clothes" ] }
//                            ]
//                         }
//                      }
//                  },
//                  {$sort: {createdTime: -1}},
//                  {$limit: 6}
//             ],
//             "as": "items"
//         }
//     }, 
//     {
//         $project:{
//             _id: 1,
//             items: 1,
//             shopLocation: 1,
//             itemsCount: { "$size": { "$ifNull": ["$items", []] } }
//         }
//     },
//     { $sort : {  itemsCount: -1 } },
//     { $match: { itemsCount: { $gte: 1 }, shopLocation: {$lte: 50} }},
//     { $limit: 6 },
//     { $sample: { size: 6 } }
// ]);


// db.getCollection('users').aggregate([
//     {
//         $geoNear: {
//             near: { coordinates: [ 30.6184854, 76.3649714 ] },
//             distanceField: "shopLocation",
//             distanceMultiplier	: 1/1000,
//             spherical: true
//         }
//     },
//     {
//         $project: {
//             _id: 1,
//             itemCode: 1,
//             userId: 1,
//             shopLocation: 1,
//             isShown: { 
//                 $and: [
//                     {$ne: [ { $indexOfArray: [ [ ], "$_id"] }, -1 ]}
//                 ] 
//             }
//         }
//     },
//     { $match: { isShown: false }},
//     {
//         $lookup: {
//             "from": "products",
//             "let": { idd: "$_id" },
//             "pipeline": [
//                 {$match: 
//                     { $expr:
//                         { $and:
//                            [
//                              { $eq: [ "$userId",  "$$idd" ] },
//                              { $ne: [ { $indexOfArray: [ ["clothes", "suits"], "$category" ] }, -1 ] }
//                            ]
//                         }
//                      }
//                  },
//                  {$sort: {createdTime: -1}},
//                  {$limit: 6}
//             ],
//             "as": "items"
//         }
//     }, 
//     {
//         $project:{
//             _id: 1,
//             items: 1,
//             shopLocation: 1,
//             itemsCount: { "$size": { "$ifNull": ["$items", []] } }
//         }
//     },
//     { $sort : {  itemsCount: -1 } },
//     { $match: { itemsCount: { $gte: 1 }, shopLocation: {$lte: 150} }},
//     { $limit: 6 },
//     { $sample: { size: 6 } }
// ]);


//Search api aggregate
// db.getCollection('users').aggregate([
//          {
//             $geoNear: {
//                 near: { coordinates: [ 30.6184854, 76.3649714 ] },
//                 distanceField: "shopLocation",
//                 distanceMultiplier	: 1/1000,
//                 spherical: true
//             }
//         },
//         {
//             $project: {
//                     _id: 1,
//                     shopLocation: 1
//                 }
//         },
//         {
//             $lookup: {
//                 "from": "products",
//                 "let": { idd: "$_id" },
//                 "pipeline": [
//                     {$match: 
//                         { $expr:
//                             { $and:
//                                [
//                                  { $eq: [ "$userId",  "$$idd" ] },
//                                  { $ne: [ { $indexOfArray: [ ["clothes", "suits"], "$category" ] }, -1 ] },
//                                  { $ne: [ { $indexOfCP: [ "$name", "test" ] }, -1]}
//                                ]
//                             }
//                          }
//                      },
//                      {$sort: {createdTime: -1}},
//                 ],
//                 "as": "products"
//             }
//         },
//         { $match: { shopLocation: {$lte: 100} } }
// ]);


//View portal
// db.getCollection('users').aggregate([
//     { $match: { _id: ObjectId("5bd5d1a7d1d7fcf5fd4708a6")}},
//     {
//         $project: {
//             _id: 1,
//             name: 1,
//             buisness_name: 1,
//             mobile_number: 1,
//             buisness_address: 1,
//             imageUrl: 1
//         }
//     },
//     {
//         $lookup: {
//             "from": "userFollow",
//             "let": { idd: "$_id" },
//             "pipeline": [
//                 {$match: 
//                     { $expr:
//                         { $or:
//                            [
//                              { $eq: [ "$userId",  "$$idd" ] },
//                              { $eq: [ "$sellerId", "$$idd" ] }
//                            ]
//                         }
//                      }
//                  },
//                  {
//                     $group: {
//                         _id: "$_id",
//                         followers: {$sum: {
//                                 $cond:[
//                                     { $eq: [ "$userId",  "$$idd" ] },
//                                     1,
//                                     0
//                                 ]}
//                         },
//                         following: {$sum: {
//                                 $cond:[
//                                     { $eq: [ "$sellerId",  "$$idd" ] },
//                                     1,
//                                     0
//                                 ]}
//                         }
//                     }
//                  }
//             ],
//             "as": "otherData"
//         }
//     }
// ]);

// db.getCollection('users').aggregate([
//     { $match: { _id: ObjectId("5bd5d1a7d1d7fcf5fd4708a6")}},
//     {
//         $project: {
//             _id: 1
//         }
//     },
//     {
//         $lookup: {
//             "from": "products",
//             "let": { idd: "$_id" },
//             "pipeline": [
//                 {
//                     $match: 
//                         { 
//                             $expr:
//                                 { 
//                                     $and:
//                                        [
//                                          { $eq: [ "clothes",  "$category" ] },
//                                          { $eq: [ "$userId",  "$$idd" ] }
//                                        ]
//                                 }
//                         }
//                 }
//             ],
//             "as": "new"
//         }
//     }
// ]);

//Search api
// db.getCollection('users').aggregate([
//          {
//             $geoNear: {
//                 near: { coordinates: [ 30.6184854, 76.3649714 ] },
//                 distanceField: "shopLocation",
//                 distanceMultiplier	: 1/1000,
//                 spherical: true
//             }
//         },
//         {
//             $project: {
//                     _id: 1,
//                     shopLocation: 1
//                 }
//         },
//         {
//             $lookup: {
//                 "from": "products",
//                 "let": { idd: "$_id" },
//                 "pipeline": [
//                     {
//                         $addFields: {
//                                 price: { $convert: { input: "$price", to: "double", onNull: null}}
//                             }
//                     },
//                     {$match: 
//                         { $expr:
//                             { $and:
//                                [
//                                  { $eq: [ "$userId",  "$$idd" ] },
//                                  { $gte: [ "$price", 3 ]},
//                                  { $lte: [ "$price", 15 ]},
//                                  { $ne: [ { $indexOfArray: [ ["clothes", "suits"], "$category" ] }, -1 ] },
//                                  { $ne: [ { $indexOfCP: [ "$name", "test" ] }, -1]}
//                                ]
//                             }
//                          }
//                      },
//                      {$sort: {createdTime: -1}}
//                 ],
//                 "as": "product"
//             }
//         },
//         { $match: { shopLocation: {$lte: 100} } },
//         { $unwind: "$product" }
// ]);

//Get product via id
// db.getCollection('products').aggregate([
//     {$match: { _id: ObjectId("5bd5d55cd1d7fcf5fd4708b0")}},
//     {
//             $lookup: {
//                     from: "users",
//                     let: { id: "$userId"},
//                     pipeline: [
//                         {
//                             $geoNear: {
//                                 near: { coordinates: [ 30.6184854, 76.3649714 ] },
//                                 distanceField: "shopLocation",
//                                 distanceMultiplier	: 1/1000,
//                                 spherical: true
//                             }
//                         },
//                         { $match: { 
//                             $expr: {
//                                 $and: [
//                                     { $lte: ["$shopLocation", 100]}
//                                 ]
//                               }
//                             }
//                         },
//                         {
//                             $project: {
//                                     _id: 1,
//                                     shopLocation: 1
//                             }
//                         },
//                         {
//                             $lookup: {
//                                 from: "products",
//                                 let: { userId: "$_id"},
//                                 pipeline: [
//                                     { 
//                                         $match: { 
//                                           $expr: {
//                                             $and: [
//                                                 { $eq: ["$$userId", "$userId"]},
//                                                 { $eq: ["clothes", "$category"]}
//                                             ]
//                                           }
//                                         }
//                                     }
//                                 ],
//                                 as: 'items'
//                             }
//                         },
//                         {$unwind: "$items"},
//                         {$sort: {createdTime: -1}},
//                         {$sample: {size: 10}},
//                         {$limit: 10}
//                     ],
//                     as: "user"
//             }
//     }
// ]);

//Get producat via id
// db.getCollection('products').aggregate([
//     {$match: { _id: ObjectId("5bd5d55cd1d7fcf5fd4708b0")}},
//     {
//         $lookup: {
//             from: "users",
//             let: { userId: "$userId"},
//             pipeline: [
//                 { 
//                     $match: { 
//                       $expr: {
//                         $and: [
//                             { $eq: ["$$userId", "$_id"]},
//                         ]
//                       }
//                     }
//                 },
//             ],
//             as: 'userInfo'
//         }
//     },
//     {
//         $unwind: "$userInfo"
//     },
//     {
//             $lookup: {
//                     from: "users",
//                     let: { id: "$userId"},
//                     pipeline: [
//                         {
//                             $geoNear: {
//                                 near: { coordinates: [ 30.6184854, 76.3649714 ] },
//                                 distanceField: "shopLocation",
//                                 distanceMultiplier	: 1/1000,
//                                 spherical: true
//                             }
//                         },
//                         { $match: { 
//                             $expr: {
//                                 $and: [
//                                     { $lte: ["$shopLocation", 100]}
//                                 ]
//                               }
//                             }
//                         },
//                         {
//                             $project: {
//                                     _id: 1,
//                                     shopLocation: 1
//                             }
//                         },
//                         {
//                             $lookup: {
//                                 from: "products",
//                                 let: { userId: "$_id"},
//                                 pipeline: [
//                                     { 
//                                         $match: { 
//                                           $expr: {
//                                             $and: [
//                                                 { $eq: ["$$userId", "$userId"]},
//                                                 { $eq: ["clothes", "$category"]}
//                                             ]
//                                           }
//                                         }
//                                     }
//                                 ],
//                                 as: 'items'
//                             }
//                         },
//                         {$unwind: "$items"},
//                         {$sort: {createdTime: -1}},
//                         {$sample: {size: 10}},
//                         {$limit: 10}
//                     ],
//                     as: "user"
//             }
//     }
// ]);

//Get product via id
// db.getCollection('products').aggregate([
//     {$match: { _id: ObjectId("5bd5d55cd1d7fcf5fd4708b0")}},
//     {
//         $lookup: {
//             from: "users",
//             let: { userId: "$userId"},
//             pipeline: [
//                 { 
//                     $match: { 
//                       $expr: {
//                         $and: [
//                             { $eq: ["$$userId", "$_id"]},
//                         ]
//                       }
//                     }
//                 },
//                 {
//                     $project: {
//                             salt: 0,
//                             status: 0,
//                             createdTime: 0,
//                             updatedTime: 0,
//                             verificationToken: 0,
//                             verificationCode: 0,
//                             userType: 0,
//                             password: 0
//                     }
//                 },
//             ],
//             as: 'userInfo'
//         }
//     },
//     {
//         $unwind: "$userInfo"
//     },
//     {
//             $lookup: {
//                     from: "users",
//                     let: { id: "$userId"},
//                     pipeline: [
//                         {
//                             $geoNear: {
//                                 near: { coordinates: [ 30.6184854, 76.3649714 ] },
//                                 distanceField: "shopLocation",
//                                 distanceMultiplier	: 1/1000,
//                                 spherical: true
//                             }
//                         },
//                         { $match: { 
//                             $expr: {
//                                 $and: [
//                                     { $lte: ["$shopLocation", 100]}
//                                 ]
//                               }
//                             }
//                         },
//                         {
//                             $project: {
//                                     _id: 1,
//                                     shopLocation: 1
//                             }
//                         },
//                         {
//                             $lookup: {
//                                 from: "products",
//                                 let: { userId: "$_id"},
//                                 pipeline: [
//                                     { 
//                                         $match: { 
//                                           $expr: {
//                                             $and: [
//                                                 { $eq: ["$$userId", "$userId"]},
//                                                 { $eq: ["clothes", "$category"]}
//                                             ]
//                                           }
//                                         }
//                                     }
//                                 ],
//                                 as: 'items'
//                             }
//                         },
//                         {$unwind: "$items"},
//                         {$sort: {createdTime: -1}},
//                         {$sample: {size: 10}},
//                         {$limit: 10}
//                     ],
//                     as: "user"
//             }
//     }
// ]);

// get comments
// db.getCollection('comments').aggregate([
//     { $match: { productId: ObjectId("5bd5d791d1d7fcf5fd4708d6") } },
//     {
//             $lookup: {
//                     from: "users",
//                     let: { userId: "$userId" },
//                     pipeline: [
//                         { $match: {
//                                 $expr: {
//                                     $and: [
//                                         { $eq: ["$_id", "$$userId"] }
//                                     ]
//                                 }
//                             }
//                         },
//                         {
//                             $project: {
//                                     name: 1,
//                                     imageUrl: 1
//                             }
//                         }
//                     ],  
//                     as: 'userInfo'
//                 }
//     },{
//            $unwind: "$userInfo"
//     }
// ]);

//Get wish products
// db.getCollection('wishProducts').aggregate([
//     {$match: { userId: ObjectId("5bd5d1b8d1d7fcf5fd4708a7")}},
//     {$unwind: "$products"},
//     {
//         $lookup: {
//             from: "products",
//             let: { products: "$products"},
//             pipeline: [
//                 { 
//                     $match: { 
//                       $expr: {
//                         $and: [
//                             { $eq: ["$$products", "$_id"]},
//                         ]
//                       }
//                     }
//                 }
//             ],
//             as: 'productInfo'
//         }
//     },
//     {$unwind: "$productInfo"}
// ]);

//Get all save messages
// db.getCollection('saveMessage').aggregate([
//     {
//         $match: {
//             $expr: {
//                  $or:[
//                         {
//                             $and: [
//                                 {$eq: ["$productId", ObjectId("5bd5d1a7d1d7fcf5fd4708a6")]},
//                                 {$eq: ["$userId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]}
//                             ]
//                         },
//                         {
//                             $and: [
//                                 {$eq: ["$userId", ObjectId("5bd5d1a7d1d7fcf5fd4708a6")]},
//                                 {$eq: ["$productId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]}
//                             ]
//                         }
//                 ]   
//             }
//         }
//     }
// ]);

//Get all save messages
// db.getCollection('saveMessage').aggregate([
//     {
//         $match: {
//             $expr: {
//                  $or:[
//                         {
//                             $and: [
//                                 {$eq: ["$productId", ObjectId("5bd5d1a7d1d7fcf5fd4708a6")]},
//                                 {$eq: ["$userId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]}
//                             ]
//                         },
//                         {
//                             $and: [
//                                 {$eq: ["$userId", ObjectId("5bd5d1a7d1d7fcf5fd4708a6")]},
//                                 {$eq: ["$productId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]}
//                             ]
//                         }
//                 ]   
//             }
//         }
//     },
//     { $sort: { "createdTime": -1 } },
//     { $limit: 50 }
// ]);


//Get all chat users
// db.getCollection('saveMessage').aggregate([
//     {
//         $match: {
//             $expr: {
//                  $or:[
//                         {$eq: ["$productId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]},
//                         {$eq: ["$userId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]}
//                 ]   
//             }
//         }
//     },
//     {
//         $lookup:{
//             from: "users",
//             let: { senderId: "$productId", userId: "$userId"},
//             pipeline: [

//             ],
//             as: "receiverInfo"
//         }
//     },
//     { $sort: { "createdTime": -1 } },
//     { $limit: 50 }
// ]);




// {
//         $lookup:{
//             from: "users",
//             let: { senderId: "$productId"},
//             pipeline: [
//                 {
//                     $match: {
//                         $expr: {$eq: ["$_id", "$$senderId"]}  
//                     }
//                 },
//                 {
//                     $project: {
//                         _id: "$_id",
//                         name: 1,
//                         imagePath: 1,
//                         imageUrl: 1
//                     }
//                 }
//             ],
//             as: "senderInfo"
//         }
//     },
//     {$unwind: "$senderInfo"},
//     {
//         $lookup:{
//             from: "users",
//             let: { receiverId: "$userId"},
//             pipeline: [
//                 {
//                     $match: {
//                         $expr: {$eq: ["$_id", "$$receiverId"]}  
//                     }
//                 },
//                 {
//                     $project: {
//                         _id: "$_id",
//                         name: 1,
//                         imagePath: 1,
//                         imageUrl: 1
//                     }
//                 }
//             ],
//             as: "receiverInfo"
//         }
//     },
//     {$unwind: "$receiverInfo"},
//     { $sort: { "createdTime": -1 } }



//Get receiver info
// db.getCollection('saveMessage').aggregate([
//     {
//         $match: {
//             $expr: {
//                  $or:[
//                         {$eq: ["$productId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]},
//                         {$eq: ["$userId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]}
//                 ]   
//             }
//         }
//     },
//     {
//         $project:{
//             receiver: { $cond: [{$eq: ["$productId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]}, "$userId", "$productId"] },
//             message: 1,
//             createdTime: 1
//         }
//     },
//     {
//         $lookup:{
//             from: "users",
//             let: { receiverId: "$receiver"},
//             pipeline: [
//                 {
//                     $match: {
//                         $expr: {$eq: ["$_id", "$$receiverId"]}  
//                     }
//                 },
//                 {
//                     $project: {
//                         _id: "$_id",
//                         name: 1,
//                         imagePath: 1,
//                         imageUrl: 1
//                     }
//                 }
//             ],
//             as: "receiverInfo"
//         }
//     },
//     { $unwind: "$receiverInfo" },
//     { $sort: { "createdTime": -1 } }
// ]);



// Get all chat users
// db.getCollection('saveMessage').aggregate([
//     {
//         $match: {
//             $expr: {
//                  $or:[
//                         {$eq: ["$productId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]},
//                         {$eq: ["$userId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]}
//                 ]   
//             }
//         }
//     },
//     {
//         $project:{
//             receiver: { $cond: [{$eq: ["$productId", ObjectId("5bd5d1b8d1d7fcf5fd4708a7")]}, "$userId", "$productId"] },
//             message: 1,
//             createdTime: 1,
//             product:1
//         }
//     },
//     {
//         $lookup:{
//             from: "users",
//             let: { receiverId: "$receiver"},
//             pipeline: [
//                 {
//                     $match: {
//                         $expr: {$eq: ["$_id", "$$receiverId"]}  
//                     }
//                 },
//                 {
//                     $project: {
//                         _id: "$_id",
//                         name: 1,
//                         imagePath: 1,
//                         imageUrl: 1
//                     }
//                 }
//             ],
//             as: "receiverInfo"
//         }
//     },
//     { $unwind: "$receiverInfo" },
//     {
//         $lookup:{
//             from: "products",
//             let: { productId: "$product"},
//             pipeline: [
//                 {
//                     $match: {
//                         $expr: {$eq: ["$_id", "$$productId"]}  
//                     }
//                 },
//                 {
//                     $project: {
//                         _id: "$_id",
//                         name: 1,
//                         images: 1
//                     }
//                 }
//             ],
//             as: "productInfo"
//         }
//     },
//     { $sort: { "createdTime": -1 } }
// ]);


// db.getCollection('homeBanners').aggregate([
//     { $unwind: "$images" },
//     { $sort: { updatedTime: -1 } },
//     { $limit: 6 }
// ]);