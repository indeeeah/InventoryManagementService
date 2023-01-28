/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

const express = require('express');
const User = require('../controlers/user/userHandler');

const userRouter = express.Router();

// Added user
userRouter.post('/', async (req, res, next) => {
    let result = await User.user(req);

    res.send(result);
});

// Login
userRouter.post('/login', async (req, res, next) => {
    let result = await User.user(req);

    res.send(result);
});

module.exports = userRouter;
