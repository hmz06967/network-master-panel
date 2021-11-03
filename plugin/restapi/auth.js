var User = require('./../database/model').user;
var md5 = require("md5");

var error = { stat: "auth", msg: "No auth" };
var success = { stat: "auth", msg: "Oturum başarılı" };

var response = (req, res, err, data) => {
    if (err == -1) {
        //login oldu http yönlendirmesi yap. redirect: data.url;
    } else if (err) {
        res.json({
            status: "error",
            message: error
        });
    } else {
        res.json({
            status: "success",
            message: success,
            data: data
        });
    }
}

var setAuth = (req, res, user) => {
    let options = {
        maxAge: 1000 * 60 * 1440 * 30, // would expire after 1 monts
        httpOnly: true, // The cookie only accessible by the web server
        //signed: true // Indicates if the cookie should be signed
    }
    var uid = user._id.toString();
    // Set cookie
    //res.cookie('uid', uid, options) // options is optional
    req.session.user = user;
}

exports.isAdmin = (session) => {
    return session.user.role == "admin"
}

exports.islogin = (session) => {
    return session.user
}

exports.getUid = (session) => {
    var user = session.user;
    if (user && typeof user["_id"] !== undefined) {
        return session.user["_id"];
    }
    return "false";
}

exports.newAuth = (req, res) => {
    var email = req.body["email"];
    var password = req.body["passw"];
    var user = null;
    //console.log(req.headers);

    if (exports.islogin(req.session)) {
        response(req, res, true, error = { stat: "auth", msg: "Önce oturumu kapayın" });
    }
    else if (email && password) {
        User.findOne({ email: req.body.email }, (err, results) => {
            if (results) {
                user = results;
                if (email === results.email && md5(password) === results.passw) {
                    setAuth(req, res, user);
                    success = { stat: "auth", msg: "Oturum başarıyla açıldı", err: false };
                } else {
                    error = { stat: "auth", msg: "Şifre doğru gözükmüyor", err: true };
                }
            } else {
                error = { stat: "auth", msg: "Böyle bir kullanıcı bulunamadı", err: true };
            }

            response(req, res, error.err, error);
        });
    }
    else {
        response(req, res, true, error = { stat: "auth", msg: "Empty auth data" });
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            response(req, res, true, error = { stat: "auth", msg: "Çıkış yapılırken sorun oluştu" });
        }
        else if (req.method == "GET") {
            res.redirect("/")
        } else {
            success = { stat: "logout", msg: "Başarıyla çıkış yaptınız" }
            res.clearCookie(uid);
            response(req, res, false, "");
        }
    });
}

exports.index = function (req, res) {
    var login = exports.islogin(req.session);
    response(req, res, !login, login);
};


exports.resp = response;