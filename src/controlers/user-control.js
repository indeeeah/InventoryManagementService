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
        } catch (e) {
            console.log(e);
        }
    };
};

module.exports.User = User;
module.exports.user = async (event) => {
    try {
        let result = {};

        console.log('event : ', event.method);

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

        return result;
    } catch (e) {
        console.log('e', e)   
    }
};
