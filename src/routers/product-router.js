/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

const express = require('express');
const UserToken = require('../middlewares/userToken');
const EventForm = require('../middlewares/eventForm');
const Product = require('../controlers/product/productHandler');

const produectRouter = express.Router();

// Get product
produectRouter.get('/', new UserToken().jwtVerify, async (req, res, next) => {
    let { company_id } = req;

    req = new EventForm().makeEventForm(req, {company_id: company_id});

    let result = await Product.product(req);

    res.send(result);
});

// Add product
produectRouter.post('/', new UserToken().jwtVerify, async (req, res, next) => {
    let { company_id } = req;

    req = new EventForm().makeEventForm(req, {company_id: company_id});

    let result = await Product.product(req);

    res.send(result);
});

// Get category
produectRouter.get('/category', new UserToken().jwtVerify, async (req, res, next) => {
    let { company_id } = req;

    req = new EventForm().makeEventForm(req, {company_id: company_id});

    let result = await Product.product(req);

    res.send(result);
});

// Added category
produectRouter.post('/category', new UserToken().jwtVerify, async (req, res, next) => {
    let { company_id } = req;

    req = new EventForm().makeEventForm(req, {company_id: company_id});

    let result = await Product.product(req);

    res.send(result);
});

produectRouter.put('/', async (req, res, next) => {
    let { id } = req.body;

    console.log('req.body : ', req.body);

    req = new EventForm().makeEventForm(req, {id: id});

    let result = await Product.product(req);

    res.send(result);
});

module.exports = produectRouter;
