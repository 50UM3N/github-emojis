const express = require('express');
const routes = express.Router();
const emoji = require('./emojis.json');

routes.get('/emojis', (req, res) => {
    res.json(emoji)
})

routes.get('/type/:id', (req, res) => {
    const searchItems = searchByType(req.params.id)
    res.json(searchItems)
})

function searchByType(data) {
    let arr = []
    emoji.forEach(e1 => {
        e1.sub_group.forEach(e2 => {
            if (e2.emojis == undefined) return
            e2.emojis.forEach(e3 => {
                if (e3.keyword == undefined) return
                for (let i = 0; i < e3.keyword.length; i++) {
                    const element = e3.keyword[i].toLowerCase();
                    if (element.search(data.toLowerCase()) > -1) {
                        let searchData = Object.assign({}, e3);
                        delete searchData['keyword']
                        arr.push(searchData)
                        break
                    }
                }
            })
        })
    })
    return (arr.splice(0, 8))
}

module.exports = routes;