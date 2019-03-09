import { Connection } from './connection';
import { CommonJs } from './common';
import { ObjectId, ObjectID } from 'mongodb';
import { SendMail } from './sendMail';
import { AppKeys } from '../utils/AppKeys';
const CommonJSInstance = new CommonJs();
const AppKeysInstance = new AppKeys();

export class AdminOperations {

    /**
     * Block user
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static blockUser(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');

                const { id, accessToken, userId } = obj;

                users.updateOne({ userId: new ObjectId(userId) }, {
                    $set: {
                        deletedStatus: AppKeysInstance.BLOCKED
                    }
                }, (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        else {
                            // var response = data.ops[0];
                            this.getCollectionData({ userId: new ObjectId(obj.userId) }, users, { projection: { password: 0, salt: 0, accessToken: 0 } }, client, cb);
                        }
                    } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                });
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
     * Get all users
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getAllUsers(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');

                const { id, accessToken, userId } = obj;

                users.find({}, { password: 0, salt: 0, accessToken: 0 }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        else CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                    } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                });
            }
        })
    }

    /**
     * Get blocked users
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getBlockedUsers(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');

                const { id, accessToken, userId } = obj;

                users.find({ deletedStatus: AppKeysInstance.BLOCKED }, { password: 0, salt: 0, accessToken: 0 }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        else CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                    } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                });
            }
        })
    }
}