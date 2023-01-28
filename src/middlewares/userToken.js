/**
 * Created by SooMinKim on 2023-01-28
 */
'use strict'

const jwt = require('jsonwebtoken');
const config = require('../../config');

class UserToken {
    constructor () {
        this._jwtSecretKey = config.jwt.secret_key;

        this.jwtVerify = (req, res, next) => {
            try {
                let token = req.headers['authorization'].split(' ')[1];
                let jwtDecoded = jwt.verify(token, this._jwtSecretKey);

                let { user_id, company_id } = jwtDecoded;

                req.user_id = user_id;
                req.company_id = company_id;

                next();
            } catch (e) {
                console.log(`\n : (Base.jwtVerify) Failed to jwt verify \n`, e);
                throw e;
            }
        };
    };
};

module.exports = UserToken;
