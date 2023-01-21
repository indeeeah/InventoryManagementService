/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

const eCode = require('../lib/errCode');
const base = require('../lib/base');
const Crypto = require('../lib/crypto');

class User extends base{
    constructor () {
        super();
        this._checkParams = (params) => (this._isValidParameter(params, 'name') && this._isValidParameter(params, 'email') && this._isValidParameter(params, 'company') && this._isValidParameter(params, 'password'));
        this._isExistedEmail = (dbItems) => (this._isValidProperty(dbItems, 'user'));

        this._getUserDbItems = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    email: params.email
                };
    
                return await this._dbHandler.getUserByEmail(dbParams);
            } catch (e) {
                console.log(`\n : (User._getUserDbItems) Failed to get user DB items \n`, e);
                throw e;
            }
        };
        this._encryptPassword = async (params) => {
            try {
                params.password = await new Crypto().encrypt_aes256cbc(params.password);
    
                return params;
            } catch (e) {
                console.log(`\n : (User._encryptPassword) Failed to encrypt password \n`, e);
                throw e;
            }
        };
        this._addUser = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    name: params.name,
                    email: params.email,
                    company: params.company,
                    password: params.password
                };

                await this._dbHandler.addUser(dbParams);
            } catch (e) {
                console.log(`\n : (User._addUser) Failed to add user \n`, e);
                throw e;
            }
        };
    };

    async addUser (event) {
        try {
            let params = this._getParams(event);
            if (!this._checkParams(params)) {eCode.throwException(eCode().InvalidParams)};

            await this._initRDS();

            let dbItems = await this._getUserDbItems(params);
            if (this._isExistedEmail(dbItems)) {eCode.throwException(eCode().UserExistedEmail)};

            params = await this._encryptPassword(params);

            await this._addUser(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success)};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (user-control.addUser) Failed to add user \n`, e);
            throw e;
        }
    };
};

module.exports.User = User;
module.exports.user = async (event) => {
    try {
        console.log(`\n : (user-control.user) ${JSON.stringify(event.body)}\n`);

        let result = {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success)};

        switch (event.method) {
            case 'GET':
                break;
            case 'POST':
                result = await (new User()).addUser(event);
                break;
            case 'PUT':
                break;
            case 'DELETE':
                break;
            default:
                result = {
                    errorCode: eCode().UnknownMethod,
                    message: `Unknown method: ${event.method}`
                };

                console.log(result);
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
