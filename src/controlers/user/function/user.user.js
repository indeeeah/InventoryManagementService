/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

const eCode = require('../../../lib/errCode');
const base = require('../../../lib/base');
const Crypto = require('../../../lib/crypto');

class User extends base {
    constructor () {
        super();
        this._hasIdProperty = (params) => (this._isValidParameter(params, 'id'));
        this._hasPasswordProperty = (params) => (this._isValidParameter(params, 'password'));
        this._hasNameProperty = (params) => (this._isValidParameter(params, 'name'));
        this._hasValidProperty = (params) => (this._isValidParameter(params, 'valid'));
        this._hasDescriptionProperty = (params) => (this._isValidParameter(params, 'descripton'));
        this._checkAddUserParams = (params) => (this._isValidParameter(params, 'name') && this._isValidParameter(params, 'email') && this._isValidParameter(params, 'company') && this._isValidParameter(params, 'password'));
        this._isExistedEmail = (dbItems) => (this._isValidProperty(dbItems, 'user'));

        this._getUser = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst
                };

                if (this._hasIdProperty(params)) {
                    dbParams['user_id'] = params.id;

                    return await this._dbHandler.getUserById(dbParams);
                }

                return await this._dbHandler.getAllUser(dbParams);
            } catch (e) {
                console.log(`\n : (User._getUser) Failed to get user \n`, e);
                throw e;
            }
        };
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
        this._updateUser = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    user_id: params.user_id
                };

                if (this._hasNameProperty(params)) {
                    dbParams['name'] = params.name;
                }
                if (this._hasPasswordProperty(params)) {
                    dbParams['password'] = params.password;
                }
                if (this._hasValidProperty(params)) {
                    dbParams['valid'] = params.valid;
                }
                if (this._hasDescriptionProperty(params)) {
                    dbParams['description'] = params.description;
                }

                await this._dbHandler.updateUser(dbParams);
            } catch (e) {
                console.log(`\n : (User._updateUser) Failed to update user \n`, e);
                throw e;
            }
        };
        this._setInvalidUser = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    user_id: params.id
                };

                await this._dbHandler.setInvalidUser(dbParams);
            } catch (e) {
                console.log(`\n : (User._setInvalidUser) Failed to set invalid user \n`, e);
                throw e;
            }
        };
    };

    async getUser (event) {
        try {
            let params = this._getPathParams(event);

            await this._initRDS();

            let result = await this._getUser(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success), data: result};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (User.getUser) Failed to get user \n`, e);
            throw e;
        }
    };

    async addUser (event) {
        try {
            let params = this._getParams(event);
            if (!this._checkAddUserParams(params)) {eCode.throwException(eCode().InvalidParams)};

            await this._initRDS();

            let dbItems = await this._getUserDbItems(params);
            if (this._isExistedEmail(dbItems)) {eCode.throwException(eCode().UserExistedEmail)};

            params = await this._encryptPassword(params);

            await this._addUser(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success)};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (User.addUser) Failed to add user \n`, e);
            throw e;
        }
    };

    async updateUser (event) {
        try {
            let pathParams = this._getPathParams(event);
            if (!this._hasIdProperty(pathParams)) {eCode.throwException(eCode().InvalidParams)};

            let params = this._getParams(event);
            params['user_id'] = pathParams.id;

            if (this._hasPasswordProperty(params)) {
                params = await this._encryptPassword(params);                
            }

            await this._initRDS();

            await this._updateUser(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success)};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (User.updateUser) Failed to update user \n`, e);
            throw e;
        }
    };

    async setInvalidUser (event) {
        try {
            let params = this._getPathParams(event);
            if (!this._hasIdProperty(params)) {eCode.throwException(eCode().InvalidParams)};

            await this._initRDS();

            await this._setInvalidUser(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success)};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (User.setInvalidUser) Failed to set invalid user \n`, e);
            throw e;
        }
    };
};

module.exports.User = User;
module.exports.user = async (event) => {
    try {
        console.log(`\n : (User.user) ${JSON.stringify(event.body)} \n`);

        let result = {};

        switch (event.method) {
            case 'GET':
                result = await (new User()).getUser(event);
                break;
            case 'POST':
                result = await (new User()).addUser(event);
                break;
            case 'PUT':
                result = await (new User()).updateUser(event);
                break;
            case 'DELETE':
                result = await (new User()).setInvalidUser(event);
                break;
            default:
                result = {
                    errorCode: eCode().UnknownMethod,
                    message: `Unknown method: ${event.method}`
                };

                console.log(`\n : (User.user) Exception on > `, result);
                break;
        }

        return result;
    } catch (e) {
        console.log(`\n : (User.user) Failed to user \n`, e);
        throw e;
    }
};
