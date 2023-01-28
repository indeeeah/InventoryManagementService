/**
 * Created by SooMinKim on 2023-01-04
 */
'use strict'

const express = require("express");
const cors = require('cors');
const viewsRouter = require('./routers/views-router');
const userRouter = require('./routers/user-router');
const productRouter = require('./routers/product-router');

const app = express();

// prevent CORS error
app.use(cors());

// Content-Type: appliocation/json
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// vue router
app.use(viewsRouter);

// api router
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

module.exports = app;
