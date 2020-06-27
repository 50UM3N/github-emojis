const express = require('express');
const routes = express.Router();
const emoji = require('./emojis.json');

routes.get('/emojis', (req, res) => {
    res.json(emoji)
})

module.exports = routes;