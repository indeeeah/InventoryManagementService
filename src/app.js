/**
 * Created by SooMinKim on 2023-01-04
 */
'use strict'

const express = require("express");
const cors = require('cors');
const viewsRouter = require('./routers/views-router');
const userRouter = require('./routers/user-router');

const app = express();

// prevent CORS error
app.use(cors());

// vue router
app.use(viewsRouter);

// api router
app.use('/api/user', userRouter);

module.exports = app;