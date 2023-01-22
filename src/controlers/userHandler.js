/**
 * Created by SooMinKim on 2023-01-21
 */
'use strict'

const eCode = require('../lib/errCode');

module.exports.user = async (event) => {
    try {
        let result = {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success)};
        let cmd = event.path.split('/')[1] !== '' ? event.path.split('/')[1] : 'user';

        switch (cmd) {
            case 'user':
                result = await (require('./function/user.user')).user(event);
                break;
            default:
                result = {
                    errorCode: eCode().UnknownCmd,
                    message: eCode.getErrorMsg(eCode().UnknownCmd)
                };

                console.log(`\n : (userHandler.user) Exception on > `, result);
                break;
        }

        return {
            statusCode: eCode.getStatusCode(result.errorCode),
            body: JSON.stringify(result)
        };
    } catch (e) {
        return eCode.handleException(event, e);
    }
};
