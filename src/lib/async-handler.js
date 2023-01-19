/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

module.exports = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (e) {
            next(e);
        }
    };
};