/**
 * Created by SooMinKim on 2023-01-18
 */

const RDS = require('./rds.db');

class DB {
    constructor () {
        this.rds = undefined;
    }

    /*********************************************************
    * Transaction - RDS
    ********************************************************/
    async startRDSConnection (params) {
        if (!this.rds) {
            this.rds = new RDS();
        }

        return await this.rds.connect(params);
    };

    async endRDSConnection (inst) {
        if (!this.rds) {
            return ;
        }

        return await this.rds.disconnect(inst);
    };

    async startRDSTransaction (inst) {
        return await this.rds.startTransaction(inst);
    };

    async commitRDSTransaction (inst) {
        return await this.rds.commitTransaction(inst);
    };

    async rollbackRDSTransaction (inst) {
        return await this.rds.rollbackTransaction(inst);
    };

    async setRDSTimezone (inst) {
        return await this.rds.setTimezone(inst);
    };

    async getRDSLock (inst, lockName, timeout) {
        return await this.rds.getLock(inst, lockName, timeout ? timeout : 10);
    };

    async releaseRDSLock (inst, lockName) {
        return await this.rds.releaseLock(inst, lockName);
    };

    /*********************************************************
    * User
    ********************************************************/
    async getAllUser (params) {
        try {
            return await this.rds.getAllUser(params.dbInst);
        } catch (e) {
            throw e;
        }
    };

    async getUserById (params) {
        try {
            return await this.rds.getUserById(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    async getUserByEmail (params) {
        try {
            return await this.rds.getUserByEmail(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    async addUser (params) {
        try {
            return await this.rds.addUser(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    async updateUser (params) {
        try {
            return await this.rds.updateUser(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    async setInvalidUser (params) {
        try {
            return await this.rds.setInvalidUser(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    /*********************************************************
    * Product
    ********************************************************/
    async getProductsByCompanyId (params) {
        try {
            return await this.rds.getProductsByCompanyId(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    async addProduct (params) {
        try {
            return await this.rds.addProduct(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    async updateProduct (params) {
        try {
            return await this.rds.updateProduct(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    async updateProductCategoryValue (params) {
        try {
            return await this.rds.updateProductCategoryValue(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    async setInvalidProduct (params) {
        try {
            return await this.rds.setInvalidProduct(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    /*********************************************************
    * Product - category
    ********************************************************/
    async getCategoryByCompanyId (params) {
        try {
            return await this.rds.getCategoryByCompanyId(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    async addCategory (params) {
        try {
            return await this.rds.addCategory(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    async updateCategory (params) {
        try {
            return await this.rds.updateCategory(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };

    async setInvalidCategory (params) {
        try {
            return await this.rds.setInvalidCategory(params.dbInst, params);
        } catch (e) {
            throw e;
        }
    };
};

module.exports = DB;
