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
}