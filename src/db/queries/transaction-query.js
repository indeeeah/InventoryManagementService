/**
 * Created by SooMinKim on 2023-01-18
 */
'use strict';

/*********************************************************
 * Transaction
 ********************************************************/
module.exports.startTransaction = () => {
    return `START TRANSACTION`;
};
module.exports.commit = () => {
    return `COMMIT`;
};
module.exports.rollback = () => {
    return `ROLLBACK`;
};
module.exports.setTimezone = () => {
    return `SET time_zone = '+9:00'`;
};
module.exports.getLock = (name, sec) => {
    return `SELECT GET_LOCK('${name}', ${sec}) AS db_lock`;
};
module.exports.releaseLock = (name) => {
    return `SELECT RELEASE_LOCK('${name}') AS db_lock`;
};