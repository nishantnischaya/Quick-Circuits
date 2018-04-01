const express = require('express')
const path = require('path')

const app = express()

app.use('/', express.static(path.join(__dirname, 'public_html')))

stages = []
names = []

app.get('/getframe', (req, res) => {
    res.send(stages)
})

app.get('/getname', (req, res) => {
    res.send(names)
})

app.get('/frame', (req, res) => {
    stages.push(req.query.add)
    res.send('success')
})

app.get('/name', (req, res) => {
    stages.push(req.query.add)
    res.send('success')
})

app.listen(3333, () => {
    console.log('Server started on http://localhost:3333')
}) 