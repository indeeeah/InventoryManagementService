/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

const express = require('express');
const userControl = require('../controlers/user-control');

const userRouter = express.Router();

// Added user
userRouter.post('/', async (req, res, next) => {
    let result = await userControl.user(req);
    console.log('req : ', res);
    return result;
});

module.exports = userRouter;
