import { Connection } from './connection';
import { CommonJs } from './common';
import { ObjectId, ObjectID } from 'mongodb';
import { SendMail } from './sendMail';
import { AppKeys } from '../utils/AppKeys';
import { SendSMS } from './sendSMS';
import { Operations } from './operations';
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
     * Send notifications to followers
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static sendNotificationWhileProductAdd(client, db, obj, cb) {
        var userFollow = db.collection('userFollow');
        let products = db.collection("products");

        const { id, itemCode, images, status } = obj;

        userFollow.aggregate([
            {
                $match: { userId: ObjectId(id) }
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$followedId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$userId"] },
                                        { $ifNull: ["$deviceToken", false] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "userData"
                }
            },
            {
                $unwind: { path: "$userData", preserveNullAndEmptyArrays: true }
            },
            {
                $match: {
                    $expr: {
                        $and: [
                            { $ifNull: ["$userData", false] }
                        ]
                    }
                }
            }
        ], (err, data) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else data.toArray((err, data) => {
                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                else {
                    products.find({ userId: new ObjectId(id), itemCode }).toArray((err, productData) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        else if (productData && productData.length) {
                            productData = productData[0];
                            const deviceTokens = data && data.length ? data.map(ele => ele.userData.deviceToken) : []
                            const message = {
                                registration_ids: deviceTokens,
                                "data": {
                                    title: productData && productData.name ? productData.name : "NA",
                                    description: productData && productData.description ? productData.description : "NA",
                                    image: images && images.length ? "http:/13.127.188.164/public/uploadProductFiles/15437477174048544ishaanvi.png" : "",
                                    productId: "5c03b87bff3b220805004dd9",
                                    notification_type: "product"
                                }
                            };

                            let that = this;
                            Operations.sendAddProductNotification(message, function (err, response) {
                                if (err) {
                                    CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                } else {
                                    // CommonJs.close(client, CommonJSInstance.SUCCESS, response, cb);
                                    that.getCollectionData({ userId: new ObjectId(id), itemCode }, products, { projection: {} }, client, cb);
                                }
                            });
                        } else CommonJs.close(client, CommonJSInstance.NOVALUE, { message: "No product found" }, cb);
                    });
                }
            });
        });
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

                products.updateOne({ userId: new ObjectId(id), itemCode }, {
                    $set: {
                        images,
                        status,
                        updatedTime: CommonJSInstance.EPOCH_TIME
                    }
                }, (err, data) => {
                    console.log("error while saving data ===> ", err, data);
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                    else {
                        // this.getCollectionData({ userId: new ObjectId(id), itemCode }, products, { projection: {} }, client, cb);
                        this.sendNotificationWhileProductAdd(client, db, obj, cb);
                    }
                });
            }
        });
    }

    /**
     * Add Banner Files
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static addBannerFiles(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var homeBanners = db.collection('homeBanners');
                const { id, images } = obj;

                homeBanners.insertOne({
                    userId: new ObjectId(id),
                    images: images,
                    status: 0,
                    deletedStatus: 0,
                    createdTime: CommonJSInstance.EPOCH_TIME,
                    updatedTime: CommonJSInstance.EPOCH_TIME
                }, (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                    else this.getCollectionData({ userId: new ObjectId(id) }, homeBanners, { projection: {} }, client, cb);
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
                            else this.viewPortal({ userId: sellerId, id }, cb);
                        });
                    } else if (data && data.length > 0) {
                        const isFollow = data[0].isFollow ? false : true;
                        userFollower.update({
                            userId: new ObjectId(id),
                            followedId: new ObjectId(sellerId)
                        }, { $set: { isFollow: isFollow } }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else this.viewPortal({ userId: sellerId, id }, cb);
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
                            else this.addRecentViewedProduct(obj, cb);
                        })
                    } else CommonJs.close(client, CommonJSInstance.NO_CHANGE, [], cb);
                });
            }
        });
    }

    /**
     * Set recent viewed product
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static addRecentViewedProduct(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var recentViewedProducts = db.collection('recentViewedProducts');
                const { id, productId } = obj;

                recentViewedProducts.find({ userId: new ObjectId(id) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length === 0) {
                        recentViewedProducts.insert({
                            userId: new ObjectId(id),
                            products: [new ObjectId(productId)]
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                        })
                    } else {
                        recentViewedProducts.updateOne({
                            userId: new ObjectId(id)
                        }, {
                                $addToSet: {
                                    products: new ObjectId(productId)
                                }
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                            })
                    }
                });
            }
        });
    }

    /**
     * Set shop view count 
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static viewShop(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                const { id, userId } = obj;

                users.find({ _id: new ObjectId(userId) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length > 0) {
                        const views = data[0].views ? data[0].views + 1 : 1;
                        users.update({
                            _id: new ObjectId(userId)
                        }, { $set: { views } }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else this.addRecentViewedShop(obj, cb);
                        })
                    } else CommonJs.close(client, CommonJSInstance.NO_CHANGE, [], cb);
                });
            }
        });
    }

    /**
     * Set recent viewed product
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static addRecentViewedShop(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var recentViewedProducts = db.collection('recentViewedShop');
                const { id, userId } = obj;

                recentViewedProducts.find({ userId: new ObjectId(id) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else if (data && data.length === 0) {
                        recentViewedProducts.insert({
                            userId: new ObjectId(id),
                            shops: [new ObjectId(userId)]
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                        })
                    } else {
                        recentViewedProducts.updateOne({
                            userId: new ObjectId(id)
                        }, {
                                $addToSet: {
                                    shops: new ObjectId(userId)
                                }
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                            })
                    }
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
                obj.searchValue = obj.searchValue ? obj.searchValue.toLowerCase() : '';
                const { id, searchValue, category, price, coordinates, area } = obj;

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
                            mobile_number: 1,
                            imageUrl: 1,
                            shopLocation: 1
                        }
                    },
                    {
                        $lookup: {
                            "from": "users",
                            "let": { idd: "$_id" },
                            "pipeline": [
                                {
                                    $addFields: {
                                        business_name: { $toLower: "$business_name" }
                                    }
                                },
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $and:
                                                category === "all" ?
                                                    [
                                                        { $eq: ["$userType", 1] },
                                                        { $ne: [{ $indexOfCP: ["$business_name", searchValue.toLowerCase()] }, -1] }
                                                    ]
                                                    : [
                                                        { $eq: ["$userType", 1] },
                                                        { $ne: [{ $indexOfCP: ["$business_name", searchValue.toLowerCase()] }, -1] },
                                                        { $ne: [{ $indexOfArray: [category, "$category"] }, -1] }
                                                    ]
                                        }
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
                                        email: 1,
                                        category: 1,
                                        business_address: 1,
                                        mobile_number: 1,
                                        imageUrl: 1,
                                        views: 1
                                    }
                                },
                                { $sort: { createdTime: -1 } },
                            ],
                            "as": "users"
                        }
                    },
                    {
                        $lookup: {
                            "from": "products",
                            "let": { idd: "$_id" },
                            "pipeline": [
                                {
                                    $addFields: {
                                        price: { $convert: { input: "$price", to: "double", onNull: null } },
                                        name: { $convert: { input: { $toLower: "$name" }, to: "string", onNull: null } }
                                    }
                                },
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $and:
                                                category === "all" && price === "all" ?

                                                    searchValue ?
                                                        [
                                                            { $eq: ["$userId", "$$idd"] },
                                                            { $ne: [{ $indexOfCP: ["$name", searchValue] }, -1] }
                                                        ] :
                                                        [
                                                            { $eq: ["$userId", "$$idd"] },
                                                        ]


                                                    :
                                                    category !== "all" && price === "all" ?

                                                        searchValue ? [
                                                            { $eq: ["$userId", "$$idd"] },
                                                            { $ne: [{ $indexOfArray: [category, "$category"] }, -1] },
                                                            { $ne: [{ $indexOfCP: ["$name", searchValue] }, -1] }
                                                        ] :
                                                            [
                                                                { $eq: ["$userId", "$$idd"] },
                                                                { $ne: [{ $indexOfArray: [category, "$category"] }, -1] },
                                                            ]

                                                        :
                                                        category === "all" && price !== "all" ?

                                                            searchValue ?
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
                                                                ]

                                                            :
                                                            searchValue ?
                                                                [
                                                                    { $eq: ["$userId", "$$idd"] },
                                                                    { $gte: ["$price", price[0]] },
                                                                    { $lte: ["$price", price[1]] },
                                                                    { $ne: [{ $indexOfArray: [category, "$category"] }, -1] },
                                                                    { $ne: [{ $indexOfCP: ["$name", searchValue] }, -1] }
                                                                ] :
                                                                [
                                                                    { $eq: ["$userId", "$$idd"] },
                                                                    { $gte: ["$price", price[0]] },
                                                                    { $lte: ["$price", price[1]] },
                                                                    { $ne: [{ $indexOfArray: [category, "$category"] }, -1] },
                                                                ]

                                        }
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "users",
                                        let: { id: "$userId" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $and: [
                                                            { $eq: ["$$id", "$_id"] }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                $project: {
                                                    _id: 1,
                                                    mobile_number: 1,
                                                    imageUrl: 1
                                                }
                                            }
                                        ],
                                        as: 'userInfo'
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "productsRatings",
                                        let: { id: "$_id" },
                                        pipeline: [
                                            {
                                                $addFields: {
                                                    rating: { $convert: { input: "$rating", to: "double", onNull: null } }
                                                }
                                            },
                                            {
                                                $match: {
                                                    $expr: {
                                                        $and: [
                                                            { $eq: ["$$id", "$productId"] }
                                                        ]
                                                    }
                                                }
                                            }
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
                                { $sort: { createdTime: -1 } }
                            ],
                            "as": "products"
                        }
                    },
                    { $match: { shopLocation: { $lte: area } } },
                    { $unwind: { path: "$products", preserveNullAndEmptyArrays: true } },
                    {
                        $group: {
                            _id: "$userType",
                            users: { $first: "$users" },
                            product: { $push: "$products" }
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
                            from: "productsRatings",
                            let: { id: "$_id" },
                            pipeline: [
                                {
                                    $addFields: {
                                        rating: { $convert: { input: "$rating", to: "double", onNull: null } }
                                    }
                                },
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$$id", "$productId"] }
                                            ]
                                        }
                                    }
                                }
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
                    {
                        $lookup: {
                            from: "users",
                            let: { id: "$userId", category: "$category" },
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
                                        shopLocation: 1,
                                        category: "$$category"
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "products",
                                        let: { userId: "$_id", category: "$category" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $and: [
                                                            { $eq: ["$$userId", "$userId"] },
                                                            { $eq: ["$$category", "$category"] }
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
                                                                rating: { $convert: { input: "$rating", to: "double", onNull: null } }
                                                            }
                                                        }
                                                    ],
                                                    as: 'rating'
                                                }
                                            },
                                            {
                                                $addFields: {
                                                    reviews: { $size: "$rating" },
                                                    rating: { $avg: "$rating.rating" }
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
                    else this.getComments(obj, cb);
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
                const { userId, id } = obj;

                console.log(JSON.stringify(obj));

                users.aggregate([
                    { $match: { _id: ObjectId(userId) } },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            business_name: 1,
                            mobile_number: 1,
                            business_address: 1,
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
                                                    { $eq: ["$followedId", "$$idd"] }
                                                ]
                                        }
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$_id",
                                        following: {
                                            $sum: {
                                                $cond: [
                                                    {
                                                        $and: [
                                                            { $eq: ["$userId", "$$idd"] },
                                                            { $eq: ["$isFollow", true] }
                                                        ]
                                                    },
                                                    1,
                                                    0
                                                ]
                                            }
                                        },
                                        followers: {
                                            $sum: {
                                                $cond: [
                                                    {
                                                        $and: [
                                                            { $eq: ["$followedId", "$$idd"] },
                                                            { $eq: ["$isFollow", true] }
                                                        ]
                                                    },
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
                                            $and:
                                                [
                                                    { $eq: ["$userId", new ObjectId(id)] },
                                                    { $eq: ["$followedId", new ObjectId(userId)] },
                                                ]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: "$_id",
                                        isFollow: {
                                            $sum: {
                                                $cond: [
                                                    {
                                                        $and: [
                                                            { $eq: ["$isFollow", true] }
                                                        ]
                                                    },
                                                    1,
                                                    0
                                                ]
                                            }
                                        }
                                    }
                                }
                            ],
                            "as": "isFollow"
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
                                                    { $eq: ["sale", "$selectType"] },
                                                    { $eq: ["$userId", "$$idd"] }
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
                                                $addFields: {
                                                    rating: { $convert: { input: "$rating", to: "double", onNull: null } }
                                                }
                                            },
                                            {
                                                $match: {
                                                    $expr: {
                                                        $and: [
                                                            { $eq: ["$$id", "$productId"] }
                                                        ]
                                                    }
                                                }
                                            }
                                        ],
                                        as: 'rating'
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "users",
                                        let: { id: "$userId" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $and: [
                                                            { $eq: ["$$id", "$_id"] }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                $project: {
                                                    imageUrl: 1,
                                                    _id: 1,
                                                    mobile_number: 1
                                                }
                                            }
                                        ],
                                        as: 'userInfo'
                                    }
                                },
                                {
                                    $addFields: {
                                        reviews: { $size: "$rating" },
                                        rating: { $avg: "$rating.rating" }
                                    }
                                }
                            ],
                            "as": "saleProducts"
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
                                                    { $eq: ["new", "$selectType"] },
                                                    { $eq: ["$userId", "$$idd"] }
                                                ]
                                        }
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "users",
                                        let: { id: "$userId" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $and: [
                                                            { $eq: ["$$id", "$_id"] }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                $project: {
                                                    imageUrl: 1,
                                                    _id: 1,
                                                    mobile_number: 1
                                                }
                                            }
                                        ],
                                        as: 'userInfo'
                                    }
                                }
                            ],
                            "as": "newProducts"
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
                                                    { $eq: ["popular", "$selectType"] },
                                                    { $eq: ["$userId", "$$idd"] }
                                                ]
                                        }
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "users",
                                        let: { id: "$userId" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $and: [
                                                            { $eq: ["$$id", "$_id"] }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                $project: {
                                                    imageUrl: 1,
                                                    _id: 1,
                                                    mobile_number: 1
                                                }
                                            }
                                        ],
                                        as: 'userInfo'
                                    }
                                }
                            ],
                            "as": "popularProducts"
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
     * Rate product
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static rateProduct(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('productsRatings');

                const { id, accessToken, rating, review, productId, userId } = obj;

                collection.find({ userId: new ObjectId(userId), productId: new ObjectId(productId) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length === 0) {
                        collection.insert({
                            userId: new ObjectId(userId),
                            productId: new ObjectId(productId),
                            rating,
                            review,
                            status: 0,
                            deletedStatus: 0,
                            createdTime: new Date().getTime(),
                            updatedTime: new Date().getTime()
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                        });
                    } else collection.updateOne({
                        userId: new ObjectId(userId),
                        productId: new ObjectId(productId)
                    }, {
                            $set: {
                                rating,
                                review,
                                updatedTime: new Date().getTime()
                            }
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                        });
                })
            }
        })
    }

    /**
     * Add Wish Product
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static addWishProduct(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('wishProducts');

                const { id, accessToken, productId, userId } = obj;

                collection.find({ userId: new ObjectId(userId) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length === 0) {
                        collection.insert({
                            userId: new ObjectId(userId),
                            products: [new ObjectId(productId)],
                            status: 0,
                            deletedStatus: 0,
                            createdTime: new Date().getTime(),
                            updatedTime: new Date().getTime()
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else this.getAddedWishProducts(obj, cb);
                        });
                    } else collection.updateOne({
                        userId: new ObjectId(userId)
                    }, {
                            $addToSet: {
                                products: new ObjectId(productId)
                            }
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else this.getAddedWishProducts(obj, cb);
                        });
                });
            }
        });
    }

    /**
     * Clear all wished products
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static clearAllWishedProducts(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('wishProducts');

                const { id, accessToken, userId } = obj;

                collection.find({ userId: new ObjectId(userId) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        collection.remove({
                            userId: new ObjectId(userId)
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else this.getAddedWishProducts(obj, cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                });
            }
        });
    }

    /**
     * Remove Wish Product
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static removeWishedProduct(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('wishProducts');

                const { id, accessToken, productId, userId } = obj;

                collection.find({ userId: new ObjectId(userId), products: { $in: [new ObjectId(productId)] } }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        collection.update({
                            userId: new ObjectId(userId), products: { $in: [new ObjectId(productId)] }
                        }, {
                                $pull: {
                                    products: new ObjectId(productId)
                                }
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                else this.getAddedWishProducts(obj, cb);
                            });
                    } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                });
            }
        });
    }

    /**
     * Get Added Wish Products
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getAddedWishProducts(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('wishProducts');

                const { id, accessToken, userId } = obj;

                collection.aggregate([
                    { $match: { userId: new ObjectId(userId) } },
                    { $unwind: "$products" },
                    {
                        $lookup: {
                            from: "products",
                            let: { products: "$products" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$$products", "$_id"] },
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: 'productInfo'
                        }
                    },
                    { $unwind: "$productInfo" }
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
     * Get Added Banners
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getAddedBanners(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('homeBanners');

                const { id, accessToken, userId } = obj;

                collection.aggregate([
                    { $unwind: "$images" },
                    { $sort: { updatedTime: -1 } },
                    { $limit: 6 }
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