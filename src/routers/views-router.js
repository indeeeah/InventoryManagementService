/**
 * Created by SooMinKim on 2023-01-19
 */
'use strict'

const express = require('express');
const path = require('path');

const viewsRouter = express.Router();

function _setViewPathFormat (resource) {
    // let resourcePath = path.join(__dirname, `../views/pages/${resource}`);
    let resourcePath = path.join(__dirname, `../views`);
    let option = { index: `i-${resource}.html` };

    return express.static(resourcePath, option);
};

viewsRouter.use('/', _setViewPathFormat('home'));
viewsRouter.use('/register', _setViewPathFormat('register'));
viewsRouter.use('/dashboard', _setViewPathFormat('dashboard'));
viewsRouter.use('/profile', _setViewPathFormat('profile'));

module.exports = viewsRouter;
