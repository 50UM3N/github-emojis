const express = require('express')
const app = express()
const routes = require('./routes')
const PORT = process.env.PORT || 8080

app.use(express.static('static'))
app.use(express.json())

app.get('/emojis', routes)
app.get('/type/:id', routes)

app.listen(PORT, e => { console.log('Server started on port ' + PORT) })