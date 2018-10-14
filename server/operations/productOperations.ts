import { Connection } from './connection';
import { CommonJs } from './common';
import { ObjectId, ObjectID } from 'mongodb';
import { SendMail } from './sendMail';
import { AppKeys } from '../utils/AppKeys';
import { SendSMS } from './sendSMS';
const CommonJSInstance = new CommonJs();
const AppKeysInstance = new AppKeys();

export class ProductOperations {

    /**
     * Add product
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static addProduct(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('products');

                const { id, accessToken, name, description, category, itemCode, price, discount, size, color, material, occasion, type, selectType } = obj;

                collection.find({ userId: new ObjectId(obj.id), itemCode: itemCode.toLowerCase() }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length === 0) {
                        collection.insert({
                            userId: new ObjectId(obj.id),
                            itemCode: itemCode.toLowerCase(),
                            name,
                            description,
                            category,
                            price,
                            discount,
                            size,
                            color,
                            material,
                            occasion,
                            type,
                            selectType,
                            status: 0,
                            deletedStatus: 0,
                            createdTime: new Date().getTime(),
                            updatedTime: new Date().getTime()
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else {
                                // var response = data.ops[0];
                                this.getCollectionData({ userId: new ObjectId(obj.id), itemCode: itemCode.toLowerCase() }, collection, { projection: {} }, client, cb)
                            }
                        });
                    } else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                })
            }
        })
    }

    /**
     * Edit product
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static editProduct(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('products');

                const { id, accessToken, name, description, category, itemCode, price, discount, size, color, material, occasion, type, selectType, status, deletedStatus } = obj;

                collection.find({ userId: new ObjectId(obj.id), itemCode: itemCode.toLowerCase() }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        collection.update(
                            { userId: new ObjectId(obj.id), itemCode: itemCode.toLowerCase() }
                            , {
                                $set: {
                                    name,
                                    description,
                                    category,
                                    price,
                                    discount,
                                    size,
                                    color,
                                    material,
                                    occasion,
                                    type,
                                    selectType,
                                    status,
                                    deletedStatus,
                                    updatedTime: new Date().getTime()
                                }
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                else {
                                    // var response = data.ops[0];
                                    this.getCollectionData({ userId: new ObjectId(obj.id), itemCode: itemCode.toLowerCase() }, collection, { projection: {} }, client, cb)
                                }
                            });
                    } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                })
            }
        })
    }

    /**
     * Get products
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getProducts(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('products');
                const { id, accessToken } = obj;

                collection.find({ userId: new ObjectId(obj.id) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                    else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                })
            }
        })
    }

    /**
     * Get product
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getProduct(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('products');
                const { id, accessToken, itemCode } = obj;

                collection.find({ userId: new ObjectId(obj.id), itemCode: itemCode.toLowerCase() }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.SUCCESS, data[0], cb);
                    else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
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
     * Edit product files
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static editProductFiles(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var products = db.collection('products');
                const { id, itemCode, images } = obj;

                products.update({ userId: new ObjectId(id), itemCode }, {
                    $set: {
                        images,
                        updatedTime: CommonJSInstance.EPOCH_TIME
                    }
                }, (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                    else this.getCollectionData({ userId: new ObjectId(id), itemCode }, products, { projection: {} }, client, cb);
                });
            }
        });
    }
}