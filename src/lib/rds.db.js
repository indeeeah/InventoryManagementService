/**
 * Created by SooMinKim on 2023-01-18
 */

const mysql = require('mysql2');
const query = require('./rds.query');

/**
 * Run MySql query
 * @param connection
 * @param sql
 * @returns {Promise<any>}
 */
let executeSQL = (connection, sql) => {
    console.log(`Executing SQL Query : ${sql.replace(/\n/gi, '')}`);
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(data);
        });
    });
};

let connectDb = (dbInst) => {
    return new Promise((resolve, reject) => {
        dbInst.connect((err) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
};

let disconnectDb = (dbInst) => {
    return new Promise((resolve, reject) => {
        dbInst.end((err) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
};

class RdsDB {
    constructor () {
        this.params = {
            host: '',
            port: '',
            user: '',
            password: '',
            database: '',
            dateStrings: 'date'
        };
    }

    /**
     * 
     * @param params {host: STRING, database:STRING, user:STRING, password:STRING, port:NUMBER}
     * @returns {Promise<void>}
     */

    /*********************************************************
    * Transaction
    ********************************************************/
    async connect (params) {
        try {
            this.params = params ? params : this.params;
            this.dbInst = await mysql.createConnection(params);

            await connectDb(this.dbInst);

            return this.dbInst;
        } catch (e) {
            console.log(`\n : (RDS.connect) Failed to connect DB : ${JSON.stringify(params)} \n`, e);
            throw e;
        }
    };

    async disconnect (dbInst) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            await disconnectDb(inst);
        } catch (e) {
            console.log(`\n : (RDS.disconnect) Failed to disconnect DB \n`, e);
            throw e;
        }
    };

    async startTransaction (dbInst) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            await executeSQL(inst, query.startTransaction());
        } catch (e) {
            console.log(`\n : (RDS.startTransaction) Failed to start transaction DB \n`, e);
            throw e;
        }
    };

    async commitTransaction (dbInst) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            await executeSQL(inst, query.commit())
        } catch (e) {
            console.log(`\n : (RDS.commitTransaction) Failed to commit transaction DB \n`, e);
            throw e;
        }
    };

    async rollbackTransaction (dbInst) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            await executeSQL(inst, query.rollback());
        } catch (e) {
            console.log(`\n : (RDS.rollbackTransaction) Failed to rollback transaction DB \n`, e);
            throw e;
        }
    };

    async setTimezone (dbInst) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            await executeSQL(inst, query.setTimezone());
        } catch (e) {
            console.log(`\n : (RDS.setTimezone) Failed to set timezone DB \n`, e);
            throw e;
        }
    };

    async getLock (dbInst, lockName, timeout) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            return await executeSQL(inst, query.getLock(lockName, timeout ? timeout : 10));
        } catch (e) {
            await executeSQL(inst, query.releaseLock(lockName));

            console.log(`\n : (RDS.getLock) Failed to get lock DB \n`, e);
            throw e;
        }
    };

    async releaseLock (dbInst, lockName) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            return await executeSQL(inst, query.releaseLock(lockName));
        } catch (e) {
            let inst = dbInst ? dbInst : this.dbInst;

            await executeSQL(inst, query.releaseLock(lockName));

            console.log(`\n : (RDS.releaseLock) Failed to release lock DB \n`, e);
            throw e;
        }
    };

    /*********************************************************
    * User
    ********************************************************/
    async getAllUser (dbInst) {
        try {
            let result = {};

            result['user'] = await executeSQL(dbInst, query.getAllUser());

            return result;
        } catch (e) {
            console.log(`\n : (RDS.getUser) Failed to get all user \n`, e);
            throw e;
        }
    };

    async getUserById (dbInst, params) {
        try {
            let result = {};

            result['user'] = await executeSQL(dbInst, query.getUserById(params));

            return result;
        } catch (e) {
            console.log(`\n : (RDS.getUserById) Failed to get user by id : ${JSON.stringify(params)} \n`, e);
            throw e;
        }
    }

    async getUserByEmail (dbInst, params) {
        try {
            let result = {};

            result['user'] = await executeSQL(dbInst, query.getUserByEmail(params));

            return result;
        } catch (e) {
            console.log(`\n : (RDS.getUserByEmail) Failed to get user by email : ${JSON.stringify(params)} \n`, e);
            throw e;
        }
    };

    async addUser (dbInst, params) {
        try {
            let company = await executeSQL(dbInst, query.getCompanyByName(params));

            if (company && company.length > 0) {
                params['company_id'] = company[0].id;
            } else {
                await executeSQL(dbInst, query.addNewCompany(params));
                let newCompany = await executeSQL(dbInst, query.getLastInsertId());
                params['company_id'] = newCompany[0]['LAST_INSERT_ID()'];
            }

            await executeSQL(dbInst, query.addNewUser(params));
        } catch (e) {
            console.log(`\n : (RDS.addUser) Failed to add user : ${JSON.stringify(params)} \n`, e);
            throw e;
        }
    };

    async updateUser (dbInst, params) {
        try {
            if (params.name) {
                await executeSQL(dbInst, query.updateUserName(params));
            }
            if (params.password) {
                await executeSQL(dbInst, query.updateUserPassword(params));
            }
            if (params.valid) {
                await executeSQL(dbInst, query.updateUserValid(params));
            }
            if (params.description) {
                await executeSQL(dbInst, query.updateUserDescription(params));
            }
        } catch (e) {
            console.log(`\n : (RDS.updateUser) Failed to update user : ${JSON.stringify(params)} \n`, e);
            throw e;
        }
    };

    async setInvalidUser (dbInst, params) {
        try {
            await executeSQL(dbInst, query.setInvalidUser(params));
        } catch (e) {
            console.log(`\n (RDS.setInvalidUser) Failed to set invalid user : ${JSON.stringify(params)} \n`, e);
            throw e;
        }
    };

    /*********************************************************
    * Product - category
    ********************************************************/
    async getCategoryByCompanyId (dbInst, params) {
        try {
            let result = {};

            result['category'] = await executeSQL(dbInst, query.getCategoryByCompanyId(params));

            return result;
        } catch (e) {
            console.log(`\n : (RDS.getCategoryByCompanyId) Failed to get category by company id : ${JSON.stringify(params)} \n`, e);
            throw e;
        }
    };

    async addCategory (dbInst, params) {
        try {
            let result = {};

            await executeSQL(dbInst, query.addCategory(params));

            result['category'] = await executeSQL(dbInst, query.getCategoryByCompanyId(params));

            return result;
        } catch (e) {
            console.log(`\n : (RDS.addCategory) Failed to add category : ${JSON.stringify(params)} \n`, e);
            throw e;
        }
    };

    async updateCategory (dbInst, params) {
        try {
            let result = {};

            if (params.name) {
                await executeSQL(dbInst, query.updateCategoryName(params));
            }
            if (params.valid) {
                await executeSQL(dbInst, query.updateCategoryValid(params));
            }
            if (params.description) {
                await executeSQL(dbInst, query.updateCategoryDescription(params));
            }

            result['category'] = await executeSQL(dbInst, query.getCategoryByCompanyId(params));

            return result;
        } catch (e) {
            console.log(`\n : (RDS.updateCategory) Failed to update category : ${JSON.stringify(params)} \n`, e);
            throw e;
        }
    };

    async setInvalidCategory (dbInst, params) {
        try {
            let result = {};

            await executeSQL(dbInst, query.setInvalidCategory(params));

            result['category'] = await executeSQL(dbInst, query.getCategoryByCompanyId(params));

            return result;
        } catch (e) {
            console.log(`\n : (RDS.setInvalidCategory) Failed to set invalid category : ${JSON.stringify(params)} \n`, e);
            throw e;
        }
    };
};

module.exports = RdsDB;
