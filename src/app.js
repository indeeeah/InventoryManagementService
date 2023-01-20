/**
 * Created by SooMinKim on 2023-01-04
 */
'use strict'

const express = require("express");
const cors = require('cors');
const viewsRouter = require('./routers/views-router');
const userRouter = require('./routers/user-router');

const app = express();

const allowedOrigins = ["http://localhost:8001", "http://localhost:8080"];

// prevent CORS error
app.use(cors({
    origin: '*',
}));

// Content-Type: appliocation/json
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// vue router
app.use(viewsRouter);

// api router
app.use('/api', userRouter);

module.exports = app;