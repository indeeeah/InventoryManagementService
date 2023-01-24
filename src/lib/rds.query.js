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

/*********************************************************
 * Last insert
 ********************************************************/
module.exports.getLastInsertId = () => {
    return `SELECT LAST_INSERT_ID()`;
};

/*********************************************************
 * User
 ********************************************************/
module.exports.getAllUser = () => {
    return `SELECT * FROM user`;
};
module.exports.getUserById = (params) => {
    return `SELECT * FROM user WHERE id=${params.user_id}`;
};
module.exports.getUserByEmail = (params) => {
    return `SELECT * FROM user WHERE email='${params.email}' AND valid=1`;
};
module.exports.addNewUser = (params) => {
    return `INSERT INTO user VALUES (NULL,
        '${params.name}',
        '${params.email}',
        '${params.password}',
        ${params.company_id},
        1,
        now(),
        NULL)`;
};

/*********************************************************
 * Company
 ********************************************************/
module.exports.getCompanyByName = (params) => {
    return `SELECT * FROM company WHERE name='${params.company}' AND valid=1`;
};
module.exports.addNewCompany = (params) => {
    return `INSERT INTO company VALUES (NULL,
        '${params.company}',
        1,
        now(),
        NULL)`;
};
