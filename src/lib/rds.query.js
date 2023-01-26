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
module.exports.updateUserName = (params) => {
    return `UPDATE user SET name='${params.name}' WHERE id=${params.user_id}`;
};
module.exports.updateUserPassword = (params) => {
    return `UPDATE user SET password='${params.password}' WHERE id=${params.user_id}`;
};
module.exports.updateUserValid = (params) => {
    return `UPDATE user SET valid=${params.valid} WHERE id=${params.user_id}`;
};
module.exports.updateUserDescription = (params) => {
    return `UPDATE user SET description='${params.description}' WHERE id=${params.user_id}`;
};
module.exports.setInvalidUser = (params) => {
    return `UPDATE userr SET valid=0 WHERE id=${params.user_id}`;
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

/*********************************************************
 * Company
 ********************************************************/
module.exports.getCategoryByCompanyId = (params) => {
    return `SELECT * FROM category WHERE company_id=${params.company_id}`;
};
module.exports.addCategory = (params) => {
    return `INSERT INTO category VALUES (NULL,
        '${params.name}',
        ${params.company_id},
        1,
        now(),
        NULL)`;
};
module.exports.updateCategoryName = (params) => {
    return `UPDATE category SET name='${params.name}' WHERE id=${category_id}`;
};
module.exports.updateCategoryValid = (params) => {
    return `UPDATE category SET valid=${params.valid} WHERE id=${category_id}`;
};
module.exports.updateCategoryDescription = (params) => {
    return `UPDATE category SET description='${params.description}' WHERE id=${category_id}`;
};
module.exports.setInvalidCategory = (params) => {
    return `UPDATE category SET valid=0 WHERE id=${category_id}`;
};
