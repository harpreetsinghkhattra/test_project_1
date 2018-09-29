import { Operations } from '../operations/operations';
import { CommonJs } from '../operations/common';

const CommonJsInstance = new CommonJs();
export class Auth {
    static userAuth(req, res, next, key) {
        CommonJs.validate(key, req.body, (status, emptyKeys) => {
            if (status) {
                Operations.isUserLoggedIn(req.body, (status, response) => {
                    if (status === CommonJsInstance.LOGED_IN) next();
                    else CommonJs.httpResponse(req, res, status, response);
                })
            } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
        });
    }

    static authUsingSocket(key, data, next) {
        console.log(typeof data);
        CommonJs.validate(key, data, (status, emptyKeys) => {
            if (status) {
                Operations.isUserLoggedIn(data, (status, response) => {
                    if (status === CommonJsInstance.LOGED_IN) next(status, response);
                    else next(status, response);
                })
            } else next(CommonJsInstance.VALIDATE_ERROR, emptyKeys);
        });
    }
}