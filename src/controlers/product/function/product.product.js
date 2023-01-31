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
        this._hasNameProperty = (params) => (this._isValidParameter(params, 'name'));
        this._hasAmountProperty = (params) => (this._isValidParameter(params, 'amount'));
        this._hasValidProperty = (params) => (this._isValidParameter(params, 'valid'));
        this._hasDescriptionProperty = (params) => (this._isValidParameter(params, 'description'));
        this._hasValueProperty = (params) => (this._isValidParameter(params, 'value'));
        this._hasValuesProperty = (params) => (this._isValidProperty(params, 'values'));
        this._checkAddProductParams = (params) => (this._isValidParameter(params, 'name') && this._isValidParameter(params, 'amount'));

        this._getProduct = async (params) => {
            try {
                let dbParams = {
                    dbInst: this._rdsInst,
                    company_id: params.company_id
                };

                return await this._dbHandler.getProductsByCompanyId(dbParams);
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
                    name: params.name,
                    amount: params.amount
                };

                if (this._hasValuesProperty(params)) {
                    dbParams['values'] = params.values;
                }

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
                    product_id: params.product_id
                };

                if (this._hasNameProperty(params)) {
                    dbParams['name'] = params.name;
                }
                if (this._hasAmountProperty(params)) {
                    dbParams['amount'] = params.amount;
                }
                if (this._hasValidProperty(params)) {
                    dbParams['valid'] = params.valid;
                }
                if (this._hasDescriptionProperty(params)) {
                    dbParams['descripton'] = params.descripton;
                }
                if (this._hasValuesProperty(params)) {
                    for (let i = 0 ; i < params.values.length ; i++) {
                        dbParams['product_category_id'] = params.values[i].category_id;
    
                        if (this._hasValueProperty(params.values[i])) {
                            dbParams['value'] = params.values[i].value;
                        }
                        if (this._hasValidProperty(params.values[i])) {
                            dbParams['valid'] = params.values[i].valid;
                        }
                        if (this._hasDescriptionProperty(params.values[i])) {
                            dbParams['description'] = params.values[i].description;
                        }
    
                        await this._dbHandler.updateProductCategoryValue(dbParams);
                    }
                }

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

                await this._dbHandler.setInvalidProduct(dbParams);
            } catch (e) {
                console.log(`\n : (Product._setInvalidProduct) Failed to set invalid product \n`, e);
                throw e;
            }
        };
        this._setCategoryValue = (result, item) => {
            try {
                let index = result.findIndex(element => {
                    return element.product_category_id === item.product_category_id;
                });

                if (index > -1) {
                    result[index].product_category_id = item.product_category_id;
                    result[index].product_category_name = item.product_category_name;
                    result[index].product_category_value = item.product_category_value_value;
                }

                return result;
            } catch (e) {
                console.log(`\n : (Product._setCategoryValue) Failed to set category value \n`, e);
                throw e;
            }
        };
        this._trimValueItems = (dbItems, item) => {
            try {
                let result = [];

                dbItems.category.forEach(item => {
                    result.push({
                        product_category_id: item.id,
                        product_category_name: item.name,
                        product_category_value: ''
                    });
                });

                result = this._setCategoryValue(result, item);

                return result;
            } catch (e) {
                console.log(`\n : (Product._trimValueItems) Failed to trim value items \n`, e);
                throw e;
            }
        };
        this._trimDbItems = (dbItems) => {
            try {
                let result = [];

                dbItems.product.forEach(item => {
                    let index = result.findIndex(element => {
                        return element.product_id === item.product_id;
                    });

                    if (index > -1) {
                        this._setCategoryValue(result[index].product_values, item);
                    } else {
                        let product_values = this._trimValueItems(dbItems, item);

                        result.push({
                            product_id: item.product_id,
                            product_name: item.product_name,
                            product_amount: item.product_amount,
                            product_values: product_values
                        });
                    }
                });

                return result;
            } catch (e) {
                console.log(`\n : (Product._trimDbItems) Failed to trim DB items \n`, e);
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

            let result = this._trimDbItems(dbItems);

            console.log('result : ', JSON.stringify(result));

            await this._destroyRDS();

            return {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success), data: result};
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

            let params = this._getParams(event);
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
            let pathParams = this._getPathParams(event);
            if (!this._hasIdProperty(pathParams)) {eCode.throwException(eCode().InvalidParams)};

            let params = this._getParams(event);
            params['product_id'] = pathParams.id;

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
