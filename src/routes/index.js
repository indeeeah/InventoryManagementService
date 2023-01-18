/**
 * Created by SooMinKim on 2023-01-04
 */
'use strict'

const router = require("express").Router();

router.get("/", (req, res) => {
    res.end("Hello World");
});

module.exports = router;