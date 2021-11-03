
let db = require('./plugin/database//db')();
let session = require('express-session');



exports.apiRoutes = require('./plugin/restapi/router');
//exports.baseRoutes = require('./base');
