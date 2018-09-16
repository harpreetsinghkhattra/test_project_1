import * as crypto from 'crypto';
var apiKeys = require('./config');

export class CommonJs {

    public NOT_VALID: string = 'notValid';
    public SUCCESS: string = 'success';
    public SUCCESS_WITH_EMAIL_CHANGE: string = 'successWithEmailChange';
    public ERROR: string = 'err';
    public PRESENT: string = 'present';
    public NOVALUE: string = 'noValue';
    public OBJECT_EMPTY: string = 'objEmpty';
    public TOKEN_ERROR: string = 'tokenErr';
    public VALIDATE_ERROR: string = 'validationErr';
    public VARIFICATION_ERROR: string = 'verificationErr';
    public BOOKING_PRESENT: string = 'bookingPrsent'
    public BASE_URL: string = "http://localhost:4000/";
    public EMAIL_PRESENT: string = "emailPresent";
    public LOGED_IN: string = "logedIn";
    public LOGED_OUT: string = "logedOut";
    public REQUEST_ACCEPTED: string = "requestAccepted";
    public REQUEST_DECLINED: string = "requestDeclined";
    public CHANGE: string = "change";
    public NO_CHANGE: string = "no_change";
    public EPOCH_TIME: number = new Date().getTime()

    constructor() {

    }

    /**
     * Check for, is object empty?
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static isObjectEmpty(obj, cb) {
        let names = Object.getOwnPropertyNames(obj);
        cb((names.length === 0) ? true : false, names)
    }

    /**
     * Check for, is data array format?
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static isDataArray(obj, cb) {
        cb(obj.length !== undefined ? true : false);
    }

    /**
     * For sorting
     * @param {*any} a 
     * @param {*any} b 
     */
    static compare(a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

    /**
     * Validate email address
     * @param {*string} email 
     */
    static validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /**
     * Random password
     * @param {*string} username 
     * @param {*string} given_password 
     * @param {*function} cb 
     */
    static randomPassword(username: string, given_password: string, cb: any) {
        var pasword = Math.random().toString();
        var temp = pasword.match(/[1-9]/g);
        var pass = '';
        for (var i = 0; i < 7; i++) {
            pass += temp[i];
        }

        if (given_password !== null && given_password !== '' && given_password !== undefined) {
            var encrypt: any = '';
            var cipher = crypto.createCipher('aes192', username)
                .on('readable', function () {
                    var data: any = cipher.read();
                    if (data) {
                        encrypt += data.toString('hex');
                    }
                })
                .on('end', function () {
                    cb(encrypt.toString('hex'), username);
                });
            cipher.write(given_password);
            cipher.end();

        } else {

            var encrypt: any = '';
            var cipher = crypto.createCipher('aes192', username)
                .on('readable', function () {
                    var data: any = cipher.read();
                    if (data) {
                        encrypt += data.toString('hex');
                        // cb(data.toString('hex'), username);
                    }
                })
                .on('end', function () {
                    cb(encrypt.toString('hex'), username);
                });;
            cipher.write(pass);
            cipher.end();
        }
    }

    /**
     * Random token
     * @param {*string} username 
     */
    static generateToken(username, cb) {

        var tempToken = Math.floor(Math.random() * 1000000000) + '';

        var encrypt = '';
        var cipher = crypto.createCipher('aes192', username)
            .on('readable', function () {
                var data: any = cipher.read();
                if (data) {
                    encrypt += data.toString('hex');
                }
            })
            .on('end', function () {
                cb(encrypt, username);
            });
        cipher.write(tempToken);
        cipher.end();
    }

    /**
     * Decrypt the data
     * @param {*string} username 
     * @param {*string} password 
     * @param {*function} cb 
     */
    static decryptData(username, password, cb) {
        if (password) {
            var decipher = crypto.createDecipher('aes192', username)
                .on('readable', function () {
                    var data: any = decipher.read();
                    if (data) {
                        cb(data.toString('utf8'));
                    }
                });
            decipher.write(password, 'hex');
            decipher.end();
        }
    }

    /**
     * Lawyerup response while operation has done
     * @param {*request} req 
     * @param {*response} res 
     * @param {*string} status 
     * @param {*array|object} response 
     */
    static httpResponse(req, res, status, response) {
        switch (status) {
            case 'success':
                res.status(200)
                    .json({
                        status: 200,
                        code: 1,
                        data: response,
                        message: "Success",
                        emptyKeys: null,
                        error: false
                    })
                break;
            case 'successWithEmailChange':
                res.status(200)
                    .json({
                        status: 200,
                        code: 1,
                        data: response,
                        message: "SuccessWithEmailChange",
                        emptyKeys: null,
                        error: false
                    })
                break;
            case 'err':
                res.status(200)
                    .json({
                        status: 400,
                        code: 1,
                        data: response,
                        message: "Error",
                        emptyKeys: null,
                        error: false
                    })
                break;
            case 'notValid':
                res.status(200)
                    .json({
                        code: 1,
                        status: 401,
                        data: [],
                        message: "NotValid",
                        emptyKeys: null,
                        error: false
                    })
                break;
            case 'present':
                res.status(200)
                    .json({
                        code: 1,
                        status: 400,
                        data: response,
                        message: "Present",
                        emptyKeys: null,
                        error: false
                    })
                break;
            case 'noValue':
                res.status(200)
                    .json({
                        code: 1,
                        status: 400,
                        data: [],
                        message: "NoValue",
                        emptyKeys: null,
                        error: false
                    })
                break;
            case 'objEmpty':
                res.status(200)
                    .json({
                        code: 1,
                        status: 400,
                        data: [],
                        message: "ObjEmpty",
                        emptyKeys: null,
                        error: false
                    })
                break;
            case "validationErr":
                res.status(200)
                    .json({
                        code: 1,
                        status: 400,
                        data: [],
                        message: "ValidationError",
                        emptyKeys: response,
                        error: false
                    })
                break;
            case "verificationErr":
                res.status(200)
                    .json({
                        code: 1,
                        status: 401,
                        data: [],
                        message: "VarificationError",
                        emptyKeys: response,
                        error: false
                    })
                break;
            case "emailPresent":
                res.status(200)
                    .json({
                        code: 1,
                        status: 200,
                        data: response,
                        message: "EmailPresent",
                        emptyKeys: [],
                        error: false
                    })
                break;
            case "logedIn":
                res.status(200)
                    .json({
                        code: 1,
                        status: 200,
                        data: response,
                        message: "LogedIn",
                        emptyKeys: [],
                        error: false
                    })
                break;
            case "logedOut":
                res.status(200)
                    .json({
                        code: 1,
                        status: 200,
                        data: response,
                        message: "LogedOut",
                        emptyKeys: [],
                        error: false
                    })
                break;
            case "requestAccepted":
                res.status(200)
                    .json({
                        code: 1,
                        status: 200,
                        data: response,
                        message: "RequestAccepted",
                        emptyKeys: [],
                        error: false
                    })
                break;
            case "requestDeclined":
                res.status(200)
                    .json({
                        code: 1,
                        status: 200,
                        data: response,
                        message: "RequestDeclined",
                        emptyKeys: [],
                        error: false
                    })
                break;
            default:
                res.status(200)
                    .json({
                        code: 1,
                        status: 500,
                        data: [],
                        message: "InternalServerError",
                        emptyKeys: null,
                        error: false
                    })
        }
    }

    /**
     * Lawyerup response while operation has done
     * @param {*string} status 
     * @param {*array|object} response 
     */
    static socketResponse(status, response) {
        switch (status) {
            case 'success':
                return {
                    status: 200,
                    code: 1,
                    data: response,
                    message: "Success",
                    emptyKeys: null,
                    error: false
                };
            case 'err':
                return {
                    status: 400,
                    code: 1,
                    data: [],
                    message: "Error",
                    emptyKeys: null,
                    error: false
                };
            case 'notValid':
                return {
                    code: 1,
                    status: 401,
                    data: [],
                    message: "NotValid",
                    emptyKeys: null,
                    error: false
                };
            case 'present':
                return {
                    code: 1,
                    status: 400,
                    data: response,
                    message: "Present",
                    emptyKeys: null,
                    error: false
                };
            case 'noValue':
                return {
                    code: 1,
                    status: 400,
                    data: [],
                    message: "NoValue",
                    emptyKeys: null,
                    error: false
                };
            case 'objEmpty':
                return {
                    code: 1,
                    status: 400,
                    data: [],
                    message: "ObjEmpty",
                    emptyKeys: null,
                    error: false
                };
            case "validationErr":
                return {
                    code: 1,
                    status: 400,
                    data: [],
                    message: "ValidationError",
                    emptyKeys: response,
                    error: false
                };
            case "verificationErr":
                return {
                    code: 1,
                    status: 401,
                    data: [],
                    message: "VarificationError",
                    emptyKeys: response,
                    error: false
                };
            case "emailPresent":
                return {
                    code: 1,
                    status: 200,
                    data: response,
                    message: "EmailPresent",
                    emptyKeys: [],
                    error: false
                };
            default:
                return {
                    code: 1,
                    status: 500,
                    data: [],
                    message: "InternalServerError",
                    emptyKeys: null,
                    error: false
                };
        }
    }

    /**
     * Check for, is data array format?
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static close(client, status, response, cb) {
        if (client) {
            client.close();
            cb(status, response);
        } else {
            cb(status, response);
        }
    }

    /**
     * Merge objects
     * @param {*object} obj 
     * @param {*function} oldObj 
     */
    static mergeObject(obj, oldObj) {
        return Object.assign(obj, oldObj)
    }

    /**
     * Validate the request 
     * @param {*object} obj 
     */
    static validate(key, obj, cb) {
        this.isObjectEmpty(obj, (status, names) => {
            console.log(names);
            if (!status) {
                var existedFields = {
                    keys: names,
                    emptyKeys: []
                }
                apiKeys.routesFields[key].forEach((element, index) => {
                    !obj[element] && existedFields.emptyKeys.push({ fieldName: element, message: element + " field is empty" });
                });

                //Specific fields validations
                existedFields.emptyKeys.length <= 0 &&
                    existedFields.keys.forEach((element) => {
                        switch (element) {
                            case "email":
                                !this.validateEmail(obj["email"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Email address is not valid." });
                                break;
                            case "confirm_password":
                                obj["password"] !== obj["confirm_password"] && existedFields.emptyKeys.push({ fieldName: ["password", "confirm_password"], message: "Password is not matched." });
                                break;
                        }
                    });

                cb(existedFields.emptyKeys.length > 0 ? false : true, existedFields.emptyKeys);
            } else cb(false, apiKeys.routesFields[key]);
        })
    }
}