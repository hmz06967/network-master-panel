var Models = require('./../../database/model');
var validator = require("validator");
var md5 = require("md5");

var error = { msg: "Kayıt hatası, bir sorun oluştu", stat: "new_machine" };
var success = { msg: "Başarılı.", stat: "new_machine" };

let Campute = Models.campute;
let schema = Models.schema.campute

var is_valid = function (params) {
    error = { msg: "Boş alanları lütfen doldurun.", stat: "new_machine" };

    if (!validator.isIP(params.ip)) {
        error = { stat: "user_add:validate error", msg: "İp adresiniz doğru değil!" };
        return false;
    } 
    else if (!params.name.length > 1) {
        error = { stat: "user_add:validate error", msg: "Makine ismi 1 karakterden büyük olmalı." };
        return false;
    }
    else if (params.setupon) {


        if (!params.uname.length > 1) {
            error = { stat: "user_add:validate error", msg: "Kullanıcı adı 1 karakterden büyük olmalı" };
            return false;
        }
        else if (!params.passw.length > 1) {
            error = { stat: "user_add:validate error", msg: "Parola 1 karakterden büyük olmalı" };
            return false;
        }
        else if (!params.tempd) {
            error = { stat: "user_add:validate error", msg: "Temp yolu hatalı" };
            return false;
        }
        else if (!params.plotd) {
            error = { stat: "user_add:validate error", msg: "Plot yolu hatalı" };
            return false;
        }
        else if (!params.plotter) {
            error = { stat: "user_add:validate error", msg: "Kazıcı seçimi hatalı" };
            return false;
        }

    } 

    
    /*for (const key in params) {
        if (!Object.hasOwnProperty.call(schema, key)) {
            error = { fields: params, missing: key, stat: "user_add:validate error", msg: "Boş yerler var ekleyemiyoruz." };
            return false;
        }
    }*/

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
            message: success,
            data: data
        });
    }
}

/*******express response*********/

exports.SSH = function (req, res) {
    return '<div class="position-relative"><div class="alert">Henüz Makine Yok</div></div>'
}

exports.new = function (req, res) {
    if (!req.session.user) return false;

    var params = req.body;

    params.uid = req.session.user._id;
    params.date = new Date();
    params.info = "-";

    params.setup.plotn = parseInt(params.plotn) > 0 ? params.plotn : 10;
    params.setup.automount = params.automount ? true : false;
    params.setup.autocopy = params.autocopy ? true : false;
    params.setup.logfollow = params.logfollow ? true : false;
    params.status = params.setupon ? "kuruluyor" : "izleme";

    if (is_valid(params)) {
        params.setup.plotter = params.plotter;
        params.setup.tempd = params.plotter;
        params.setup.plotd = params.plotter;

        Campute.findOne({ ip: params.ip }, (err, results) => {
            var campute = new Campute(params);
            if (!results)
                campute.save(function (err) {
                    success = { msg: params.name + " başarıyla kaydedildi.", stat: "new_machine" };
                    response(req, res, err, params);
                });
            else {
                response(req, res, true, error = { msg: "Daha önce aynı ip ile bir kayıt oluşturdun", stat: "new_machine" })
            }
        });
    } else {
        response(req, res, true, error)
    }

};

exports.view = function (req, res) {

    if (!req.session.user) return false;
    error = { stat: "view:campute_list", msg: "Henüz sunucu eklenmemiş" };

    Campute.find({ uid: req.session.user._id }, { passw: 0, uname: 0 },function (err, data) {
        response(req, res, err, data)
    });
};

exports.update = function (req, res) {
    if (!req.session.user) return false;

    Campute.findById(req.body.cid, function (err, user) {
        Campute.save(function (err) {
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
    if (!req.session.user) return false;

    if (Mail.user.success("remove"))
        User.remove({
            _id: req.params.uid
        }, function (err, user) {
            response(req, res, err, user)
        });
};