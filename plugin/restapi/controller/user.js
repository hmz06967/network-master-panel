var Models = require('./../../database/model');
var validator = require("validator");
var md5 = require("md5");

var error = { msg: "Kayıt hatası, bir kaydınız olabilir.", stat: "new_user" };
var success = { msg: "Başarıyla kayıt oldunuz. Yönlendiriliyor..", stat: "new_user" };

let User = Models.user;
 
var is_valid = function (params) {
    error = { msg: "Boş alanları lütfen doldurun.", stat: "new_user"};

    for (const key in params) {
        if (!Object.hasOwnProperty.call(Models.schema.user, key)) {
            error = { fields: params, missing: key, stat: "user_add:validate error", msg: "Empty user data not adding new user" };
            return false;
        }
    } 

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
    else if (!params.name.length > 2) {
        error = { stat: "user_add:validate error", msg: "İsminiz 2 karakterden büyük olmalı." };
        return false;
    }

    return true;
}

var msg = function (body, name) {
    name = body;
    return name;
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
            message: success,
            data: data
        });
    }
}

/*******express response*********/
exports.new = function (req, res) {
    
    var params = req.body;

    params.role = "normal";
    params.date = new Date();
    params.completed = false;
    params.access = "free";

    if (is_valid(params)) {

        params.passw = md5(params.passw);
        User.findOne({ email: params.email }, (err, results) => {
            var user = new User(params);
            if (!results)
                user.save(function (err) {
                    success = { msg: "Başarıyla kayıt oldunuz.", stat: "new_user" };
                    response(req, res, err, "");
                });
            else {
                response(req, res, true, error = { msg: "Daha önce bir kayıt oluşturdun giriş yapabilirsin.", stat: "new_user" })
            }
        });
    }else{
        response(req, res, true, error)
    }

};


exports.index = function (req, res) {
    User.find({}, function (err, user) {
        response(req, res, err, user)
    }).limit(parseInt(req.query.limit));
};

exports.view = function (req, res) {
    User.findById(req.params.uid, function (err, user) {
        response(req, res, err, user)
    });
};

exports.update = function (req, res) {
    User.findById(req.body.uid, function (err, user) {
        User.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Contact Info updated',
                data: contact
            });
        });
    });
};

exports.delete = function (req, res) {
    if(Mail.user.success("remove"))
    User.remove({
        _id: req.params.uid
    }, function (err, user) {
        response(req, res, err, user)
    });
};