/**
 * Created by SooMinKim on 2023-01-18
 */
'use strict';

const TransactionService = require('../services/transaction-service');
const config = require('../../config');

class Base {
    constructor () {
        /*********************************************************
        * DB
        ********************************************************/
        this._tHandler = new TransactionService();
        this._rdsInst = undefined;
        this._lockName = '';
        this._setLockName = (lockName) => { this._lockName = lockName; };
        this._getLockName = () => { return this._lockName; };

        // Transaction - RDS
        this._startRDSConnection = async () => {
            if (this._rdsInst === undefined) {
                this._rdsInst = await this._tHandler.startRDSConnection(config.db.rds);
            }
        };
        this._endRDSConnection = async () => {
            if (this._rdsInst !== undefined) {
                await this._tHandler.endRDSConnection(this._rdsInst);
                this._rdsInst = undefined;
            }
        };
        this._startRDSTransaction = async () => {
            if (this._rdsInst !== undefined) {
                await this._tHandler.startRDSTransaction(this._rdsInst);
            }
        };
        this._commitRDSTransaction = async () => {
            if (this._rdsInst !== undefined) {
                await this._tHandler.commitRDSTransaction(this._rdsInst);
            }
        };
        this._rollbackRDSTransaction = async () => {
            if (this._rdsInst !== undefined) {
                await this._tHandler.rollbackRDSTransaction(this._rdsInst);
            }
        };
        this._setRDSTimezone = async () => {
            if (this._rdsInst !== undefined) {
                return await this._tHandler.setRDSTimezone(this._rdsInst);
            }
        };

        this._getRDSLock = async (lockName, timeout) => {
            if (this._rdsInst !== undefined) {
                return await this._tHandler.getRDSLock(this._rdsInst, lockName, timeout);
            }
        };
        this._releaseRDSLock = async (lockName) => {
            if (this._rdsInst !== undefined) {
                return await this._tHandler.releaseRDSLock(this._rdsInst, lockName);
            }
        };
        
        this._initRDS = async (lockName) => {
            await this._startRDSConnection();
            await this._setRDSTimezone();

            if (lockName && lockName !== '') {
                await this._getRDSLock(lockName);
            }
            
            await this._startRDSTransaction();
        };
        this._destroyRDS = async (lockName) => {
            await this._commitRDSTransaction();

            if (lockName && lockName !== '') {
                await this._releaseRDSLock(lockName);
            }

            await this._endRDSConnection();
        };
        this._restoreRDS = async (lockName) => {
            await this._rollbackRDSTransaction();

            if (lockName && lockName !== '') {
                await this._releaseRDSLock(lockName);
            }

            await this._endRDSConnection();
        };

        /*********************************************************
        * Parameters
        ********************************************************/
        this._getParams = (event) => JSON.parse(event.body);
        this._getPathParams = (event) => event.pathParameters ? event.pathParameters : {};
        this._getQueryParams = (event) => event.queryStringParameters ? event.queryStringParameters : {};
        this._getHeaderParams = (event) => event.headers ? event.headers : {};
        
        /*********************************************************
        * Common
        ********************************************************/
        this._isValidProperty = (obj, property) => { return obj.hasOwnProperty(property) && obj[property].length > 0 };
        this._isValidParameter = (params, property) => { return params && typeof params == 'object' && params.hasOwnProperty(property) };
    };
};

module.exports = Base;