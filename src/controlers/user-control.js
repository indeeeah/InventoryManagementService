/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

const eCode = require('../lib/errCode');
const base = require('../lib/base');

class User extends base{
    constructor () {
        super();
    };

    async addUser (event) {
        try {

            console.log('event : ', event.body);

            return {errorCode: eCode().success, message: eCode.getErrorMsg(eCode().success)};
        } catch (e) {
            console.log(e);
            throw e;
        }
    };
};

module.exports.User = User;
module.exports.user = async (event) => {
    try {
        console.log(`\n (user-control.user) \n`);

        let message = `successfully have done`;
        let statusCode = 200;
        let result = {errorCode: eCode().success, message: eCode.getErrorMsg(eCode().success)};

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
                    errorCode: eCode().success,
                    message: `Unknown method: ${event.method}`
                };

                console.log(result);
                break;
        }

        return {
            statusCode: eCode.getStatusCode(result.errorCode),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            },
            body: JSON.stringify(result)
        };
    } catch (e) {
        console.log('e', e)   
    }
};
