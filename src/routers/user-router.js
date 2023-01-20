/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

const express = require('express');
const userControl = require('../controlers/user-control');

const userRouter = express.Router();

// Added user
userRouter.post('/register', async (req, res, next) => {
    console.log('req : ', req.body);
    let result = await userControl.user(req);

    console.log('result : ', result);
    return result;
});

module.exports = userRouter;
