/**
 * Created by SooMinKim on 2023-01-25
 */
'use strict'

const eCode = require('../../lib/errCode');

module.exports.product = async (event) => {
    try {
        let result = {errorCode: eCode().Success, message: eCode.getErrorMsg(eCode().Success)};
        let cmd = event.path.split('/')[1] !== '' ? event.path.split('/')[1] : 'product';

        switch (cmd) {
            case 'product':
                result = await (require('./function/product.product')).product(event);
                break;
            case 'category':
                result = await (require('./function/product.category')).category(event);
                break;
            default:
                result = {
                    errorCode: eCode().UnknownCmd,
                    message: eCode.getErrorMsg(eCode().UnknownCmd)
                };

                console.log(`\n : (productHandler.product) Exception on > `, result);
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
