let router = require('express').Router();
let db = require('./../database/db')();

router = require('./session')(router);

router.use(function (q, r, n) {
    //console.log('after session:', q.session); 
    sessionID = q.session; n();
});

module.exports.apiRoutes = router = require('./restapi/router')(router);
module.exports.baseRoutes = require('./base')(router);
