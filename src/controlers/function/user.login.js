/**
 * Created by SooMinKim on 2023-01-22
 */
'use strict'

const eCode = require('../../lib/errCode');
const base = require('../../lib/base');
const Crypto = require('../../lib/crypto');

class Login extends base {
    constructor () {
        super();
    };

    async login (event) {
        try {
            let params = this._getHeaderParams(event);
            if (!this._checkLoginParams(params)) {eCode.throwException(eCode().InvalidParams)};

            await this._initRDS();

            let dbItems = await this._getUserDbItems(params);

            if (!this._isExistedUser(dbItems)) {eCode.throwException(eCode().UserInvalidEmail)}
            if (!this._isMatchedPassword(params, dbItems)) {eCode.throwException(eCode().UserInvalidPassword)};

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success), data: dbItems};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (Login.login) Failed to login \n`, e);
            throw e;
        }
    };
};

module.exports.Login = Login;
module.exports.login = async (event) => {
    try {
        console.log(`\n : (Login.log) ${JSON.stringify(event.body)} \n`);

        let result = {};

        switch (event.method) {
            case 'GET':
                result = await (new Login()).login(event);
                break;
            case 'POST':
            case 'PUT':
            case 'DELETE':
            default:
                result = {
                    errorCode: eCode().UnknownMethod,
                    message: `Unknown method: ${event.method}`
                };

                console.log(`\n : (Login.login) Exception on > `, result);
                break;
        }

        return result;
    } catch (e) {
        console.log(`\n : (Login.login) Failed to login \n`, e);
        throw e;
    }
};
