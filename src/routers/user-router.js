/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

const express = require('express');
const UserToken = require('../middlewares/userToken');
const EventForm = require('../middlewares/eventForm');
const User = require('../controlers/user/userHandler');

const userRouter = express.Router();

userRouter.get('/', new UserToken().jwtVerify, async (req, res, next) => {
    let { user_id } = req;

    req = new EventForm().makeEventForm(req, {id: user_id});

    let result = await User.user(req);

    res.send(result);
});

// Added user
userRouter.post('/', async (req, res, next) => {
    let result = await User.user(req);

    res.send(result);
});

// Update user
userRouter.put('/', new UserToken().jwtVerify, async (req, res, next) => {
    let { user_id } = req;

    req = new EventForm().makeEventForm(req, {id: user_id});

    let result = await User.user(req);

    res.send(result);
});

// Login
userRouter.post('/login', async (req, res, next) => {
    let result = await User.user(req);

    res.send(result);
});

module.exports = userRouter;
