/**
 * Created by SooMinKim on 2023-01-04
 */
'use strict'

const express = require("express");
const cors = require('cors');
const http = require('http').createServer(app),
    port = 8001;

const app = express();

// prevent CORS error
app.use(cors());

http.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
