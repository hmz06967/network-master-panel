let express = require('express');
let bodyParser = require('body-parser');
let apiRoutes = require("./router");
let cookieParser = require('cookie-parser');

module.exports = (app)=>{

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use('/api', apiRoutes);
    app.use('/', baseRoutes);

    app.use('/src', express.static("src"));

    return app;
}