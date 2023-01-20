/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

const eCode = require('../lib/errCode');
const base = require('../lib/base');

class User extends base{
    constructor () {
        super();
        this._getUserDbItems = async (params) => {
            let dbParams = {
                dbInst: this._rdsInst,
                email: params.email
            };

            return await this._dbHandler.getUserByEmail(dbParams);
        }
    };

    async addUser (event) {
        try {
            let params = this._getParams(event);
            await this._initRDS();

            let dbItems = await this._getUserDbItems(params);
            console.log('dbItems : ', JSON.stringify(dbItems));

            await this._destroyRDS();

            return {errorCode: eCode().success, message: eCode.getErrorMsg(eCode().success)};
        } catch (e) {
            await this._restoreRDS();
            console.log(`\n : (user-control.addUser) Failed to add user ${e} \n`);
            throw e;
        }
    };
};

module.exports.User = User;
module.exports.user = async (event) => {
    try {
        console.log(`\n (user-control.user) ${event.body}\n`);

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
            body: JSON.stringify(result)
        };
    } catch (e) {
        console.log('e', e)   
    }
};
