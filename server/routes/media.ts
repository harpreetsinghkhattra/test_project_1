import * as express from 'express';
import * as multer from 'multer';
import * as path from 'path';
import { Operations } from '../operations/operations';
import { CommonJs } from '../operations/common';
import { Auth } from './auth';
import { AppKeys } from '../utils/AppKeys';

var router = express.Router();
const CommonJsInstance = new CommonJs();

/** Media files storage */
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), '/server/public/uploadFiles'))
    },
    filename: (req, file, cb) => {
        var randomNumber = Math.floor(Math.random() * 10000);
        var time = new Date().getTime();
        let fileName = time + '' + randomNumber + 'ishaanvi.' + file.mimetype.split('/')[1];
        let imagePath = path.join('/public/uploadFiles', fileName);

        req.body.imagePath = path.join(CommonJsInstance.BASE_URL, imagePath);
        cb(null, fileName);
    }
});

var upload = multer({ storage: storage }).any();

router.post('/editProfileImage', (req, res, next) =>
    upload(req, res, (err, data) => {
        if (err) CommonJs.httpResponse(req, res, CommonJsInstance.ERROR, err);
        else next();
    }),
    (req, res, next) => Auth.userAuth(req, res, next, 'editProfileImage'),
    (req, res) => {
        Operations.editProfileImage(req.body, (status, response) => {
            CommonJs.httpResponse(req, res, status, response);
        });
    }
);

module.exports = router;