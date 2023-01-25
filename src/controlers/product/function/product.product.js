/**
 * Created by SooMinKim on 2023-01-25
 */
'use strict'

const eCode = require('../../../lib/errCode');
const base = require('../../../lib/base');

class Product extends base {
    constructor () {
        super();
    };
};

module.exports.Product = Product;
module.exports.product = async (event) => {
    try {
        console.log(`\n : (Product.product) ${JSON.stringify(event.body)} \n`);

        let result = {};

        switch (event.method) {
            case 'GET':
            case 'POST':
            case 'PUT':
            case 'DELETE':
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
