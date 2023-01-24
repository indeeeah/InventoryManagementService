/**
 * Created by SooMinKim on 2023-01-22
 */
'use strict'

const eCode = require('../../../lib/errCode');
const base = require('../../../lib/base');
const Crypto = require('../../../lib/crypto');

class Login extends base {
    constructor () {
        super();
        this._checkLoginParams = (params) => (this._isValidParameter(params, 'email') && this._isValidParameter(params, 'password'));
        this._isExistedUser = (dbItems) => (this._isValidProperty(dbItems, 'user'));

        this._getUserDbItems = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    email: params.email
                };

                return await this._dbHandler.getUserByEmail(dbParams);
            } catch (e) {
                console.log(`\n : (Login._getUserDbItems) Failed to get user DB items \n`, e);
                throw e;
            }
        };
        this._decryptPassword = async (params) => {
            try {
                return await new Crypto().decrypt_aes256abc(params);
            } catch (e) {
                console.log(`\n : (Login._decryptPassword) Failed to decrypt password \n`, e);
                throw e;
            }
        };
        this._isMatchedPassword = async (params, dbItems) => {
            try {
                let encPassword = dbItems.user[0].password;
                let decPassword = await this._decryptPassword(encPassword);

                return (params.password === decPassword);
            } catch (e) {
                console.log(`\n : (Login._isMatchedPassword) Failed to match password \n`, e);
                throw e;
            }
        };
    };

    async login (event) {
        try {
            let params = this._getHeaderParams(event);
            if (!this._checkLoginParams(params)) {eCode.throwException(eCode().InvalidParams)};

            await this._initRDS();

            let dbItems = await this._getUserDbItems(params);

            if (!this._isExistedUser(dbItems)) {eCode.throwException(eCode().UserInvalidEmail)}
            if (!await this._isMatchedPassword(params, dbItems)) {eCode.throwException(eCode().UserInvalidPassword)};

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
