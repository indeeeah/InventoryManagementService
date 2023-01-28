/**
 * Created by SooMinKim on 2023-01-18
 */
'use strict';

let errorCode = {
    Success: 0,

    /** Common Errors */
    UnknownCmd: 100,
    UnknownMethod: 101,
    InvalidParams: 102,

    /** User */
    UserExistedEmail: 1000,
    UserInvalidEmail: 1001,
    UserInvalidPassword: 1002,
};

module.exports = function () {
    return errorCode;
};


let _getErrorMsg = (code) => {
    let msg = '';

    switch (code) {
        case errorCode.Success:
            msg = `Success`;
            break;
        case errorCode.UnknownCmd:
            msg = `잘못된 요청 패스입니다.`;
            break;
        case errorCode.UnknownMethod:
            msg = `잘못된 요청 메소드입니다.`;
            break;
        case errorCode.InvalidParams:
            msg = `필수 입력 파라메터가 없습니다.`;
            break;
        case errorCode.UserExistedEmail:
            msg = `이미 등록되어 있는 이메일입니다. \n다른 이메일로 시도해주세요.`;
            break;
        case errorCode.UserInvalidEmail:
            msg = `등록되지 않은 이메일입니다. \n확인 후 다시 시도해주세요.`;
            break;
        case errorCode.UserInvalidPassword:
            msg = `잘못된 비밀번호입니다. \n확인 후 다시 시도해주세요.`;
            break;
        default:
            break;
    };

    return msg;
};

module.exports.getErrorMsg = _getErrorMsg;


let _getStatusCode = (code) => {
    let statusCode = 200;

    switch (code) {
        case errorCode.Success:
            break;
        case errorCode.UnknownCmd:
        case errorCode.UnknownMethod:
        case errorCode.InvalidParams:
        case errorCode.UserExistedEmail:
        case errorCode.UserInvalidEmail:
        case errorCode.UserInvalidPassword:
            statusCode = 400;
            break;
        default:
            break;
    };

    return statusCode;
};

module.exports.getStatusCode = _getStatusCode;


let _throwException = (code, errMsg, data) => {
    let err = new Error('inv_error');

    err.code = code;
    err.inv_error = true;

    errMsg ? err['errMsg'] = errMsg : 0;
    data ? err['data'] = data : 0;

    throw err;
};

module.exports.throwException = _throwException;


module.exports.handleException = (event, e, name) => {
    if (e.code && e.inv_error) {
        let body = {
            errorCode: e.code,
            message: e.errMsg ? e.errMsg : _getErrorMsg(e.code)
        };

        if (e.data) {
            body['data'] = e.data;
        }

        let result = {
            statusCode: _getStatusCode(e.code),
            body : JSON.stringify(body)
        };

        return result;
    }

    console.log(`\n : (${name ? name : event.path}) Exception on \n`);
};
