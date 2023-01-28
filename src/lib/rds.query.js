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
 * Product
 ********************************************************/
module.exports.getProductsByCompanyId = (params) => {
    return `SELECT
        product.id AS product_id,
        product.name AS product_name,
        product.company_id AS company_id,
        product.amount AS product_amount,
        product_category.id AS product_category_id,
        product_category.name AS product_category_name,
        product_category_value.id AS product_category_value_id,
        product_category_value.value AS product_category_value_value
        FROM product
        INNER JOIN product_category_value ON product.id=product_category_value.product_id AND product_category_value.valid=1
        INNER JOIN product_category ON product_category_value.product_category_id=product_category.id AND product_category.valid=1
        WHERE product.valid=1
        AND product.company_id=${params.company_id}`;
};
module.exports.addProduct = (params) => {
    return `INSERT INTO product VALUES (NULL,
        '${params.name}',
        ${params.company_id},
        ${params.amount},
        1,
        now(),
        NULL)`;
};
module.exports.updateProductName = (params) => {
    return `UPDATE product SET name='${params.name}' WHERE id=${params.product_id}`;
};
module.exports.updateProductAmount = (params) => {
    return `UPDATE product SET amount=${params.amount} WHERE id=${params.product_id}`;
};
module.exports.updateProductValid = (params) => {
    return `UPDATE product SET valid=${params.valid} WHERE id=${params.product_id}`;
};
module.exports.updateProductDescription = (params) => {
    return `UPDATE product SET description='${params.description}' WHERE id=${params.product_id}`;
};
module.exports.setInvalidProduct = (params) => {
    return `UPDATE product SET valid=0 WHERE id=${params.product_id}`;
};

/*********************************************************
 * Product - category
 ********************************************************/
module.exports.getCategoryByCompanyId = (params) => {
    return `SELECT * FROM product_category WHERE company_id=${params.company_id}`;
};
module.exports.addCategory = (params) => {
    return `INSERT INTO product_category VALUES (NULL,
        '${params.name}',
        ${params.company_id},
        1,
        now(),
        NULL)`;
};
module.exports.updateCategoryName = (params) => {
    return `UPDATE product_category SET name='${params.name}' WHERE id=${params.category_id}`;
};
module.exports.updateCategoryValid = (params) => {
    return `UPDATE product_category SET valid=${params.valid} WHERE id=${params.category_id}`;
};
module.exports.updateCategoryDescription = (params) => {
    return `UPDATE product_category SET description='${params.description}' WHERE id=${params.category_id}`;
};
module.exports.setInvalidCategory = (params) => {
    return `UPDATE product_category SET valid=0 WHERE id=${params.category_id}`;
};

/*********************************************************
 * Product - category value
 ********************************************************/
module.exports.getProductCategoryValueByProductIdAndCategoryId = (params) => {
    return `SELECT * FROM product_category_value WHERE product_id=${params.product_id} AND product_category_id=${params.product_category_id}`;
};
module.exports.addProductCategoryValue = (params) => {
    return `INSERT INTO product_category_value VALUES (NULL,
        ${params.product_id},
        ${params.product_category_id},
        '${params.value}',
        1,
        now(),
        NULL)`;
};
module.exports.updateProductCategoryValueValue = (params) => {
    return `UPDATE product_category_valud SET value='${params.value}'`;
};
module.exports.updateProductCategoryValueValid = (params) => {
    return `UPDATE product_category_valud SET valid=${params.valid}`;
};
module.exports.updateProductCategoryValueDescription = (params) => {
    return `UPDATE product_category_valud SET description='${params.description}'`;
};
