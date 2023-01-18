const express = require('express');
const path = require('path');

const viewsRouter = express.Router();

function _setViewPathFormat (resource) {
    let resourcePath = path.join(__dirname, `../views/pages/${resource}`);
    let option = { index: `${resource}.html` };

    return express.static(resourcePath, option);
};

viewsRouter.use('/', _setViewPathFormat('home'));

module.exports = viewsRouter;