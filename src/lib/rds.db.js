/**
 * Created by SooMinKim on 2023-01-18
 */

const mysql = require('mysql');
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
            console.log(`\n : (RDS.connect) Failed to connect DB : ${JSON.stringify(params)} \n`);
            throw e;
        }
    };

    async disconnect (dbInst) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            await disconnectDb(inst);
        } catch (e) {
            console.log(e.message);
            console.log(e.stack);
            console.log(`\n : (RDS.disconnect) Failed to disconnect DB \n`);
            throw e;
        }
    };

    async startTransaction (dbInst) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            await executeSQL(inst, query.startTransaction());
        } catch (e) {
            console.log(`\n : (RDS.startTransaction) Failed to start transaction DB \n`);
            throw e;
        }
    };

    async commitTransaction (dbInst) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            await executeSQL(inst, query.commit())
        } catch (e) {
            console.log(`\n : (RDS.commitTransaction) Failed to commit transaction DB \n`);
            throw e;
        }
    };

    async rollbackTransaction (dbInst) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            await executeSQL(inst, query.rollback());
        } catch (e) {
            console.log(`\n : (RDS.rollbackTransaction) Failed to rollback transaction DB \n`);
            throw e;
        }
    };

    async setTimezone (dbInst) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            await executeSQL(inst, query.setTimezone());
        } catch (e) {
            console.log(`\n : (RDS.setTimezone) Failed to set timezone DB \n`);
            throw e;
        }
    };

    async getLock (dbInst, lockName, timeout) {
        try {
            let inst = dbInst ? dbInst : this.dbInst;

            return await executeSQL(inst, query.getLock(lockName, timeout ? timeout : 10));
        } catch (e) {
            await executeSQL(inst, query.releaseLock(lockName));

            console.log(`\n : (RDS.getLock) Failed to get lock DB \n`);
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

            console.log(`\n : (RDS.releaseLock) Failed to release lock DB \n`);
            throw e;
        }
    };

    /*********************************************************
    * Transaction
    ********************************************************/
    async getUserByEmail (dbInst, params) {
        try {
            let result = {};

            result['user'] = await executeSQL(dbInst, query.getUserByEmail(params));

            return result;
        } catch (e) {
            console.log(`\n : (RDS.getUserByEmail) Failed to get user by email \n`);
            throw e;
        }
    }
}

module.exports = RdsDB;
