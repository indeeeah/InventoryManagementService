/**
 * Created by SooMinKim on 2023-01-26
 */
'use strict'

const eCode = require('../../../lib/errCode');
const base = require('../../../lib/base');

class Category extends base {
    constructor () {
        super();
        this._hasIdProperty = (params) => (this._isValidParameter(params, 'id'));
        this._hasCompanyIdProperty = (params) => (this._isValidParameter(params, 'company_id'));
        this._hasNameProperty = (params) => (this._isValidParameter(params, 'name'));
        this._hasValidProperty = (params) => (this._isValidParameter(params, 'valid'));
        this._hasDescriptionProperty = (params) => (this._isValidParameter(params, 'description'));
        this._checkAddCategoryParams = (params) => (this._isValidParameter(params, 'name'));

        this._getCategory = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    company_id: params.company_id
                };

                return await this._dbHandler.getCategoryByCompanyId(dbParams);
            } catch (e) {
                console.log(`\n : (Category._getCategory) Failed to get category \n`, e);
                throw e;
            }
        };
        this._addCategory = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    name: params.name,
                    company_id: params.company_id
                };

                return await this._dbHandler.addCategory(dbParams);
            } catch (e) {
                console.log(`\n : (Category._addCategory) Failed to add category \n`, e);
                throw e;
            }
        };
        this._updateCategory = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    category_id: params.category_id,
                    company_id: params.company_id
                };

                if (this._hasNameProperty(params)) {
                    dbParams['name'] = params.name;
                }
                if (this._hasValidProperty(params)) {
                    dbParams['valid'] = params.valid;
                }
                if (this._hasDescriptionProperty(params)) {
                    dbParams['description'] = params.description;
                }

                return await this._dbHandler.updateCategory(dbParams);
            } catch (e) {
                console.log(`\n : (Category._updateCategory) Failed to update category \n`, e);
                throw e;
            }
        };
        this._setInvalidCateogory = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    category_id: params.category_id,
                    company_id: params.company_id
                };

                return await this._dbHandler.setInvalidCategory(dbParams);
            } catch (e) {
                console.log(`\n : (Category._setInvalidCategory) Failed to set invalid category \n`, e);
                throw e;
            }
        };
    };

    async getCategory (event) {
        try {
            let params = this._getPathParams(event);
            if (!this._hasCompanyIdProperty(params)) {eCode.throwException(eCode().InvalidParams)};

            await this._initRDS();

            let dbItems = await this._getCategory(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success), data: dbItems};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (Category.getCategory) Failed to get category \n`, e);
            throw e;
        }
    };

    async addCategory (event) {
        try {
            let pathParams = this._getPathParams(event);
            if (!this._hasCompanyIdProperty(params)) {eCode.throwException(eCode().InvalidParams)};

            let params = this._getParams(event);
            if (!this._checkAddCategoryParams(params)) {eCode.throwException(eCode().InvalidParams)};
            params['company_id'] = pathParams.company_id;

            await this._initRDS();

            let result = await this._addCategory(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success), data: result};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (Category.addCategory) Failed to add category \n`, e);
            throw e;
        }
    };

    async updateCategory (event) {
        try {
            let pathParams = this._getPathParams(event);
            if (!this._hasIdProperty(pathParams)) {eCode.throwException(eCode().InvalidParams)};

            let params = this._getParams(event);
            if (!this._hasCompanyIdProperty(params)) {eCode.throwException(eCode().InvalidParams)};
            params['category_id'] = pathParams.id;

            await this._initRDS();

            let result = await this._updateCategory(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success), data: result};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (Category.updateCategory) Failed to update category \n`, e);
            throw e;
        }
    };

    async setInvalidCategory (event) {
        try {
            let params = this._getPathParams(event);
            if (!this._hasIdProperty(params)) {eCode.throwException(eCode().InvalidParams)};

            let queryParams = this._getQueryParams(event);
            if (!this._hasCompanyIdProperty(queryParams)) {eCode.throwException(eCode().InvalidParams)};
            params['category_id'] = queryParams.id;

            await this._initRDS();

            let result = await this._setInvalidCateogory(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success), data: result};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (Category.setInvalidCategory) Failed to set invalid category \n`, e);
            throw e;
        }
    };
};

module.exports.Category = Category;
module.exports.category = async (event) => {
    try {
        console.log(`\n : (Category.category) ${JSON.stringify(event.body)} \n`);

        let result = {};

        switch (event.method) {
            case 'GET':
                result = await (new (Category())).getCategory(event);
                break;
            case 'POST':
                result = await (new (Category())).addCategory(event);
                break;
            case 'PUT':
                result = await (new (Category())).updateCategory(event);
                break;
            case 'DELETE':
                result = await (new (Category())).setInvalidCategory(event);
                break;
            default:
                result = {
                    errorCode: eCode().UnknownMethod,
                    message: `Unknown method: ${event.method}`
                };

                console.log(`\n : (Category.category) Exception on > `, result);
                break;
        }

        return result;
    } catch (e) {
        console.log(`\n : (Category.category) Failed to category \n`, e);
        throw e;
    }
};
