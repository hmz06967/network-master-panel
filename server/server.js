'use strict';

//const http = require('http');
const express = require('express');
const app = express();

let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let db = require('./plugin/database//db')();
var session = require('./plugin/session')(app);
var apiRoutes = require('./plugin/restapi/router');
var baseRoutes = require('./base');


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/src', express.static("server/src"));
app.use('/', baseRoutes);
app.use('/api', apiRoutes);
 

var port = process.env.PORT || 80;

app.listen(port, function () {
    console.log("Server running.. " + port);
});

