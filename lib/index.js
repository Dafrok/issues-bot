require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const moduleIssuePage = require('./modules/issue-page.js')
const moduleHook = require('./modules/hook.js')

const port = process.env.PORT
const token = process.env.token

const app = express()

app.use(bodyParser.json())

app.get('/', moduleIssuePage);
app.post('/hook', moduleHook);

app.listen(port);