import * as express from 'express';
import * as multer from 'multer';
import * as path from 'path';
import { Operations } from '../operations/operations';
import { ProductOperations } from '../operations/productOperations';
import { CommonJs } from '../operations/common';
import { Auth } from './auth';
import { AppKeys } from '../utils/AppKeys';

var router = express.Router();
const CommonJsInstance = new CommonJs();

/** Media files storage */
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), '/server/public/uploadProductFiles'))
    },
    filename: (req, file, cb) => {
        var randomNumber = Math.floor(Math.random() * 10000);
        var time = new Date().getTime();
        let fileName = time + '' + randomNumber + 'ishaanvi.' + file.mimetype.split('/')[1];
        let imagePath = path.join('/public/uploadProductFiles', fileName);

        req.body.images = req.body.images && req.body.images.length ? req.body.images : [];
        req.body.images.push(path.join(CommonJsInstance.BASE_URL, imagePath));
        cb(null, fileName);
    }
});

var upload = multer({ storage: storage }).any();

router.post('/uploadProductFiles', (req, res, next) =>
    upload(req, res, (err, data) => {
        if (err) CommonJs.httpResponse(req, res, CommonJsInstance.ERROR, err);
        else next();
    }),
    (req, res, next) => Auth.userAuth(req, res, next, 'uploadProductFiles'),
    (req, res) => {
        ProductOperations.editProductFiles(req.body, (status, response) => {
            CommonJs.httpResponse(req, res, status, response);
        });
    }
);

router.post('/uploadBannerImages', (req, res, next) =>
    upload(req, res, (err, data) => {
        if (err) CommonJs.httpResponse(req, res, CommonJsInstance.ERROR, err);
        else next();
    }),
    (req, res, next) => Auth.userAuth(req, res, next, 'uploadBannerImages'),
    (req, res) => {
        ProductOperations.addBannerFiles(req.body, (status, response) => {
            CommonJs.httpResponse(req, res, status, response);
        });
    }
);

module.exports = router;