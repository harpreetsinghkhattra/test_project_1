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

                collection.find({ userId: new ObjectId(obj.id) }).sort({ $natural: -1 }).toArray((err, data) => {
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
                const { id, itemCode, images, status } = obj;

                products.update({ userId: new ObjectId(id), itemCode }, {
                    $set: {
                        images,
                        status,
                        updatedTime: CommonJSInstance.EPOCH_TIME
                    }
                }, (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                    else this.getCollectionData({ userId: new ObjectId(id), itemCode }, products, { projection: {} }, client, cb);
                });
            }
        });
    }

    /**
     * Follow user
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static followUser(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var userFollower = db.collection('userFollow');
                const { id, sellerId } = obj;

                console.log(obj);
                userFollower.find({ userId: new ObjectId(id), followedId: new ObjectId(sellerId) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (id === sellerId) CommonJs.close(client, CommonJSInstance.NO_CHANGE, [], cb);
                    else if (data && data.length === 0) {
                        userFollower.insert({
                            userId: new ObjectId(id),
                            followedId: new ObjectId(sellerId),
                            isFollow: true
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                        });
                    } else if (data && data.length > 0) {
                        const isFollow = data[0].isFollow ? false : true;
                        userFollower.update({
                            userId: new ObjectId(id),
                            followedId: new ObjectId(sellerId)
                        }, { $set: { isFollow: isFollow } }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                        })
                    } else CommonJs.close(client, CommonJSInstance.NO_CHANGE, [], cb);
                });
            }
        });
    }

    /**
     * Set view count
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static viewProduct(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var products = db.collection('products');
                const { id, productId } = obj;

                products.find({ _id: new ObjectId(productId) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length > 0) {
                        const views = data[0].views ? data[0].views + 1 : 1;
                        products.update({
                            _id: new ObjectId(productId)
                        }, { $set: { views } }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                        })
                    } else CommonJs.close(client, CommonJSInstance.NO_CHANGE, [], cb);
                });
            }
        });
    }

    /**
     * View portal
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static viewUserPortal(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var products = db.collection('products');
                const { id, productId } = obj;

                products.find({ _id: new ObjectId(productId) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length > 0) {
                        products.update({
                            _id: new ObjectId(productId)
                        }, { $addToSet: { views: new ObjectId(id) } }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                        })
                    } else CommonJs.close(client, CommonJSInstance.NO_CHANGE, [], cb);
                });
            }
        });
    }

    /**
     * Search product
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static searchProduct(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                const { id, searchValue, category, price, coordinates, area } = obj;

                console.log(obj);
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
                            shopLocation: 1
                        }
                    },
                    {
                        $lookup: {
                            "from": "products",
                            "let": { idd: "$_id" },
                            "pipeline": [
                                {
                                    $addFields: {
                                        price: { $convert: { input: "$price", to: "double", onNull: null } }
                                    }
                                },
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $and:
                                            category === "all" && price === "all" ?
                                                [
                                                    { $eq: ["$userId", "$$idd"] },
                                                    { $ne: [{ $indexOfCP: ["$name", searchValue] }, -1] }
                                                ] :
                                                category !== "all" && price === "all" ?
                                                    [
                                                        { $eq: ["$userId", "$$idd"] },
                                                        { $ne: [{ $indexOfArray: [category, "$category"] }, -1] },
                                                        { $ne: [{ $indexOfCP: ["$name", searchValue] }, -1] }
                                                    ] :
                                                    category === "all" && price !== "all" ?
                                                        [
                                                            { $eq: ["$userId", "$$idd"] },
                                                            { $gte: ["$price", price[0]] },
                                                            { $lte: ["$price", price[1]] },
                                                            { $ne: [{ $indexOfCP: ["$name", searchValue] }, -1] }
                                                        ] :
                                                        [
                                                            { $eq: ["$userId", "$$idd"] },
                                                            { $gte: ["$price", price[0]] },
                                                            { $lte: ["$price", price[1]] },
                                                            { $ne: [{ $indexOfArray: [category, "$category"] }, -1] },
                                                            { $ne: [{ $indexOfCP: ["$name", searchValue] }, -1] }
                                                        ]
                                        }
                                    }
                                },
                                { $sort: { createdTime: -1 } }
                            ],
                            "as": "product"
                        }
                    },
                    { $match: { shopLocation: { $lte: area } } },
                    { $unwind: "$product" }
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
     * Get product via id
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getProductViaId(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var products = db.collection('products');
                const { productId, category, coordinates, area } = obj;

                products.aggregate([
                    { $match: { _id: ObjectId(productId) } },
                    {
                        $lookup: {
                            from: "users",
                            let: { userId: "$userId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$$userId", "$_id"] },
                                            ]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        salt: 0,
                                        status: 0,
                                        createdTime: 0,
                                        updatedTime: 0,
                                        verificationToken: 0,
                                        verificationCode: 0,
                                        userType: 0,
                                        password: 0
                                    }
                                },
                            ],
                            as: 'userInfo'
                        }
                    },
                    {
                        $unwind: "$userInfo"
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { id: "$userId" },
                            pipeline: [
                                {
                                    $geoNear: {
                                        near: { coordinates },
                                        distanceField: "shopLocation",
                                        distanceMultiplier: 1 / 1000,
                                        spherical: true
                                    }
                                },
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $lte: ["$shopLocation", area] }
                                            ]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        shopLocation: 1
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "products",
                                        let: { userId: "$_id" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $and: [
                                                            { $eq: ["$$userId", "$userId"] },
                                                            { $eq: [category, "$category"] }
                                                        ]
                                                    }
                                                }
                                            }
                                        ],
                                        as: 'items'
                                    }
                                },
                                { $unwind: "$items" },
                                { $sort: { createdTime: -1 } },
                                { $sample: { size: 10 } },
                                { $limit: 10 }
                            ],
                            as: "user"
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
        });
    }

    /**
     * Comment
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static createCommentForProduct(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var comments = db.collection('comments');
                const { productId, userId, message } = obj;

                comments.insert({
                    productId: new ObjectId(productId),
                    userId: new ObjectId(userId),
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
     * Get comments
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getComments(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var comments = db.collection('comments');
                const { productId } = obj;

                comments.aggregate([
                    { $match: { productId: new ObjectId(productId) } },
                    {
                        $lookup: {
                            from: "users",
                            let: { userId: "$userId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$_id", "$$userId"] }
                                            ]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        name: 1,
                                        imageUrl: 1
                                    }
                                }
                            ],
                            as: 'userInfo'
                        }
                    }, {
                        $unwind: "$userInfo"
                    }
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
     * View portal
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static viewPortal(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                const { userId } = obj;

                users.aggregate([
                    { $match: { _id: ObjectId(userId) } },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            buisness_name: 1,
                            mobile_number: 1,
                            buisness_address: 1,
                            imageUrl: 1
                        }
                    },
                    {
                        $lookup: {
                            "from": "userFollow",
                            "let": { idd: "$_id" },
                            "pipeline": [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $or:
                                            [
                                                { $eq: ["$userId", "$$idd"] },
                                                { $eq: ["$sellerId", "$$idd"] }
                                            ]
                                        }
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$_id",
                                        followers: {
                                            $sum: {
                                                $cond: [
                                                    { $eq: ["$userId", "$$idd"] },
                                                    1,
                                                    0
                                                ]
                                            }
                                        },
                                        following: {
                                            $sum: {
                                                $cond: [
                                                    { $eq: ["$sellerId", "$$idd"] },
                                                    1,
                                                    0
                                                ]
                                            }
                                        }
                                    }
                                }
                            ],
                            "as": "otherData"
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
        });
    }

    /**
     * View products via type
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static viewProductsViaType(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                const { userId, type } = obj;

                users.aggregate([
                    { $match: { _id: ObjectId(userId) } },
                    {
                        $project: {
                            _id: 1
                        }
                    },
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
                                            [
                                                { $eq: [type, "$selectType"] },
                                                { $eq: ["$userId", "$$idd"] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            "as": "products"
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
        });
    }
}