let router = require('express').Router();
var RestApi = require('./include');
var Auth = RestApi.Auth;

var respond = { status: 'ChiaMaster RestApi', message: 'No query param try again' };
var sessionID = {};
router.use(function (q, r, n) {
    //console.log('after session:', q.session); 
    sessionID = q.session; n();
    if(!sessionID.user){
       // r.status(401).send(Auth.resp(q,r,true));
    }
});

router.route('/').get(function (req, res) { res.json(respond); });
router.route('/auth').get(Auth.index).post(Auth.newAuth);
router.route('/auth/logout').get(Auth.logout).post(Auth.logout);

//restapi
if (!sessionID.user)
    var user = router.route('/user').post(RestApi.User.new);


var userManage = router.route('/user/:uid');
var campute = router.route('/campute/:uid');

user.get(RestApi.User.index);

userManage.get(RestApi.User.view)
    .patch(RestApi.User.update)
    .put(RestApi.User.update)
    .delete(RestApi.User.delete);

campute.get(RestApi.Campute.view)
    .post(RestApi.Campute.new)
    .patch(RestApi.Campute.update)
    .put(RestApi.Campute.update)
    .delete(RestApi.Campute.delete);


module.exports = router;
