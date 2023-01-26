/**
 * Created by SooMinKim on 2023-01-25
 */
'use strict'

const eCode = require('../../../lib/errCode');
const base = require('../../../lib/base');

class Product extends base {
    constructor () {
        super();
        this._hasIdProperty = (params) => (this._isValidParameter(params, 'id'));
        this._hasCompanyIdProperty = (params) => (this._isValidParameter(params, 'company_id'));
        this._checkAddProductParams = (params) => (this._isValidParameter(params, 'products'));
        this._checkUpdateProductParams = (params) => (this._isValidParameter(params, 'products'));

        this._getProduct = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    company_id: params.company_id
                };

                return await this._dbHandler.getProduct(dbParams);
            } catch (e) {
                console.log(`\n : (Product._getProduct) Failed to get product \n`, e);
                throw e;
            }
        };
        this._addProduct = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    company_id: params.company_id,
                    products: params.products
                };

                await this._dbHandler.addProduct(dbParams);
            } catch (e) {
                console.log(`\n : (Product._addProduct) Failed to add product \n`, e);
                throw e;
            }
        };
        this._updateProduct = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    products: params.products
                };

                await this._dbHandler.updateProduct(dbParams);
            } catch (e) {
                console.log(`\n : (Product._updateProduct) Failed to update product \n`, e);
                throw e;
            }
        };
        this._setInvalidProduct = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    product_id: params.id
                };

                await this._dbHandler.updateProduct(dbParams);
            } catch (e) {
                console.log(`\n : (Product._setInvalidProduct) Failed to set invalid product \n`, e);
                throw e;
            }
        };
    };

    async getProduct (event) {
        try {
            let params = this._getPathParams(event);
            if (!this._hasCompanyIdProperty(params)) {eCode.throwException(eCode().InvalidParams)};

            await this._initRDS();

            let dbItems = await this._getProduct(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success), data: dbItems};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (Product.getProduct) Failed to get product \n`, e);
            throw e;
        }
    };

    async addProduct (event) {
        try {
            let pathParams = this._getPathParams(event);
            if (!this._hasCompanyIdProperty(pathParams)) {eCode.throwException(eCode().InvalidParams)};

            let params = this._getPathParams(event);
            if (!this._checkAddProductParams(params)) {eCode.throwException(eCode().InvalidParams)};
            params['company_id'] = pathParams.company_id;

            await this._initRDS();

            await this._addProduct(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success)};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (Product.addProduct) Failed to add product \n`, e);
            throw e;
        }
    };

    async updateProduct (event) {
        try {
            let params = this._getParams(event);
            if (!this._checkUpdateProductParams(params)) {eCode.throwException(eCode().InvalidParams)};

            await this._initRDS();

            await this._updateProduct(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success)};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (Product.updateProduct) Failed to update product \n`, e);
            throw e;
        }
    };

    async setInvalidProduct (event) {
        try {
            let params = this._getPathParams(event);
            if (!this._hasIdProperty(params)) {eCode.throwException(eCode().InvalidParams)};

            await this._initRDS();

            await this._setInvalidProduct(params);

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success)};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (Product.setInvalidProduct) Failed to set invalid product \n`, e);
            throw e;
        }
    };
};

module.exports.Product = Product;
module.exports.product = async (event) => {
    try {
        console.log(`\n : (Product.product) ${JSON.stringify(event.body)} \n`);

        let result = {};

        switch (event.method) {
            case 'GET':
                result = await (new Product()).getProduct(event);
                break;
            case 'POST':
                result = await (new Product()).addProduct(event);
                break;
            case 'PUT':
                result = await (new Product()).updateProduct(event);
                break;
            case 'DELETE':
                result = await (new Product()).setInvalidProduct(event);
                break;
            default:
                result = {
                    errorCode: eCode().UnknownMethod,
                    message: `Unknown method: ${event.method}`
                };

                console.log(`\n : (Product.product) Exception on > `, result);
                break;
        }

        return result;
    } catch (e) {
        console.log(`\n : (Product.product) Failed to product \n`, e);
        throw e;
    }
};
