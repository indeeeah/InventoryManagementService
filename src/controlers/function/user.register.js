/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

const eCode = require('../../lib/errCode');
const base = require('../../lib/base');
const Crypto = require('../../lib/crypto');

class Register extends base {
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
                console.log(`\n : (Register._getUserDbItems) Failed to get user DB items \n`, e);
                throw e;
            }
        };
        this._encryptPassword = async (params) => {
            try {
                params.password = await new Crypto().encrypt_aes256cbc(params.password);
    
                return params;
            } catch (e) {
                console.log(`\n : (Register._encryptPassword) Failed to encrypt password \n`, e);
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
                console.log(`\n : (Register._addUser) Failed to add user \n`, e);
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
            console.log(`\n : (Register.addUser) Failed to add user \n`, e);
            throw e;
        }
    };
};

module.exports.Register = Register;
module.exports.register = async (event) => {
    try {
        console.log(`\n : (Register.register) ${JSON.stringify(event.body)}\n`);

        let result = {};

        switch (event.method) {
            case 'POST':
                result = await (new Register()).addUser(event);
                break;
            case 'GET':
            case 'PUT':
            case 'DELETE':
            default:
                result = {
                    errorCode: eCode().UnknownMethod,
                    message: `Unknown method: ${event.method}`
                };

                console.log(`\n : (Register.register) Exception on > `, result);
                break;
        }

        return result;
    } catch (e) {
        console.log(`\n : (Register.register) Failed to register \n`, e);
        throw e;
    }
};
