/**
 *  login:  [beni hatırla]-> 1 ay çerez süresi verilir.
 *          session -> kontrolü yapılır.         
 * 
 */

var Model = require('./model');
var validator = require("validator");
var md5 = require("md5");
var parser = require('ua-parser-js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

error = { msg: "Giriş hatası.", stat: "login" };

let User = Model.user;

var is_valid = function (params) {

    if (!validator.isEmail(params.email)) {
        error = { stat: "user_add:validate error", msg: "Email adresiniz doğru değil!" };
        return false;
    }
    /* else if (!validator.isMobilePhone(params.phone, 'any')) {
         seterr({ stat: "user_add:validate error", msg: "Telefon numaranız doğru değil."});
     }*/
    else if (!params.passw.length > 7) {
        error = { stat: "user_add:validate error", msg: "Parola en az 8 karakter, büyük küçük harf ve rakam içermelidir." };
        return false;
    }

    return true;
}

var response = (req, res, err, data) => {
    if (err) {
        res.json({
            status: "error",
            message: error
        });
    } else {
        res.json({
            status: "success",
            message: "Login api",
            data: data
        });
    }
}

var password_auth = (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        console.log('run: login.password_auth');
        console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
        console.log(`req.user: ${JSON.stringify(req.user)}`)
        req.login(user, (err) => {
            console.log('run:login.passport.login()')
            console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
            console.log(`req.user: ${JSON.stringify(req.user)}`)
            return response(req, res, false, { stat: "login", msg: "başarıyla giriş yaptınız" })
        })
    })(req, res, next);
}

var login = (req, res, callback)=> {

    // configure passport.js to use the local strategy
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        (email, password, done) => {

            User.findOne({ email: params.email }, (err, results) => {
                if(results){
                    if (email === results[0].email && md5(password) === results[0].passw) {
                        callback(req, res, results);
                    }                       
                }            
            });

        }
    ));

    // tell passport how to serialize the user
    passport.serializeUser((user, done) => {
        console.log('Inside serializeUser callback. User id is save to the session file store here')
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        console.log('Inside deserializeUser callback')
        console.log(`The user id passport saved in the session file store is: ${id}`)
        const user = users[0].id === id ? users[0] : false;
        done(null, user);
    });

}

/*******func done*********/
exports.new = (req, res, next) => {

    password_auth(req, res, next);

    login(req, res,  (req, res, results) => {
        response(req, res, error.err, error);
        return true;

        var params = req.body;
        var ua = parser(req.headers['user-agent']).getDevice();
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var date = new Date();


        if (params && is_valid(params)) {
            var agent = new Model.access({ agent: ua, ip: ip, type: "login", date: date });
            agent.save(function (err) {
                response(req, res, err, { msg: "Başarıyla giriş yapıldı", stat: "login" });
            });
        } else {
            response(req, res, err, { msg: "Giriş yapılamıyor", stat: "login" });
        }
    });
};


exports.index = function (req, res) {
    response(req, res, false, { stat: "login", msg: "giriş yapılmamış" })
};

exports.view = function (req, res) {
    User.findById(req.params.uid, function (err, user) {
        response(req, res, err, user)
    });
};

exports.update = function (req, res) {
    User.findById(req.body.uid, function (err, user) {
        response(req, res, err, user)
    });
};

exports.delete = function (req, res) {
    User.remove({
        _id: req.params.uid
    }, function (err, user) {
        response(req, res, err, user)
    });
};