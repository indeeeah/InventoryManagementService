/**
 * Created by SooMinKim on 2023-01-18
 */
'use strict';

let errorCode = {
    success: 0,
};

module.exports = function () {
    return errorCode;
};


let getErrorMsg = (code) => {
    let msg = '';

    switch (code) {
        case errorCode.success:
            msg = `Success`;
            break;
        default:
            break;
    };
};

module.exports.getErrorMsg = getErrorMsg;


module.exports.getStatusCode = function (code) {
    let statusCode = 200;

    switch (code) {
        case errorCode.success:
            break;
        default:
            break;
    };

    return statusCode;
};


let _throwException = (code, errMsg, data) => {
    let err = new Error('error');

    err.code = code;
    err.error = true;

    errMsg ? err['errMsg'] = errMsg : 0;
    data ? err['data'] = data : 0;

    throw err;
};

module.exports.throwException = _throwException;
