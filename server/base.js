let router = require('express').Router();
var path = require("path");
var fs = require('fs');
var RestApi = require('./plugin/restapi/include');
var Auth = RestApi.Auth;
var User = RestApi.User;
var Campute = RestApi.Campute;

var root_path = "./server";
var sessionID = {};
router.use(function (q, r, n) {
    //console.log('after session:', q.session); 
    sessionID = q.session; n();
});

var Main = {
    "meta": {
        "tag":"{{meta}}",
        "value": ''
    }
}

var Panel = {
    "path": "panel",
    "header": false,
    "footer": false,
    "title": "Dashboard - Chia Master",
    "setup": {
        "leftbar": "panel/left-nav-bar",
        "topbar": "",
        "container": "panel/camputes",
        "campute-setup": "panel/campute-setup"
    }
}

var Base = {
    "/": {
        "path": "index-page",
        "title": "Chia Master - Arsa Yükleyici"
    },
    "/login": {
        "path": "login",
        "title": "Giriş Yap - Chia Master"
    },
    "/register": {
        "path": "register",
        "title": "Kayıt Ol - Chia Master"
    },
    "/price": {
        "path": "price",
        "title": "Limitler & Ücretler - Chia Master"
    },
    "/faq": {
        "path": "faq",
        "title": "Sıkça Sorulan Sorular- Chia Master"
    },
    "/panel": {
        "title": "Dashboard - Chia Master",
        "path": "panel/camputes",
    },
    "/panel/camputes": {
        "path": "panel/camputes",
        "title": "Makineler - Chia Master"
    },
    "/panel/clouds": {
        "path": "panel/clouds",
        "title": "Bulut Sunucular - Chia Master"
    },
    "/panel/setting": {
        "path": "panel/setting",
        "title": "Ayarlar - Chia Master"
    }
};

const imp = function (file) {
    var src = root_path + "/src/html/";
    var filepath = path.resolve(src + file + ".html");
    if (fs.existsSync(filepath))
        return fs.readFileSync(filepath, "UTF-8");
    return "not-page: " + file;
}

var tag_importer = function (req, core) {
    var base = body_parse(req);
    var cor_array = ["{{header}}", "{{body}}", "{{footer}}"];

    if(Auth.islogin(sessionID)){
        base = base.replace("{{uid}}", req.session.user._id.toString());
    }

    for (var i in Main) {
        base = base.replace(Main[i].tag, Main[i].value);
    }
    for (var i in core) {
        base = base.replace(cor_array[i], core[i]);
    }
    return base;
}

var body_parse = function (req) {
    var body = imp("index");
    var path = req.path.toLowerCase();
    return body.replace("{{title}}", Base[path].title);
}

var panel_parse = function (req, container) {
    var panel = imp("panel");
    var body_set = Panel["setup"];
    var left_bar = imp(body_set["leftbar"]);
    if(!container)container = imp(body_set["container"]);
    left_bar = left_bar.replace("{{name}}", sessionID.user.name);
    panel = panel.replace("{{left-nav-bar}}", left_bar);
    panel = panel.replace("{{panel-container}}", container);
    return panel;
}

var response = function (req, res, html, tp) {

    var type = 'text/html',
        code = 200;

    if (tp == 'json') {
        type = 'aplication/json';
        res.writeHead(code, { 'Content-Type': type });
        return res.json(JSON.stringify(html));
    }

    res.writeHead(code, { 'Content-Type': type });
    return res.end(html);
}


var get_msg = function (r, s, t) {
    var msg = {
        "status": ["error", "ok"],
        "ssh-connect": [
            "Bağlantı hatası!.",
            "Bağlantı kuruldu.",
            "Bir hata oluştu.",
            "Access denied.",
            "Lütfen geçerli bir ip adresi girin.!"
        ]
    }
    var xcode = {
        "status": msg[s],
        "message": msg[t][s],
        "response": r,
        "type": t
    }
    return xcode;
}

//page
router.route("/").get((req, res) => {
    html = tag_importer(req, [imp("header"), imp(Base[req.path].path), imp("footer")]);
    response(req, res, html);
});

router.route("/price").get((req, res) => {
    html = tag_importer(req, [imp("header"), imp(Base[req.path].path), imp("footer")]);
    response(req, res, html);
});

router.route("/faq").get((req, res) => {
    html = tag_importer(req, [imp("header"), imp(Base[req.path].path), imp("footer")]);
    response(req, res, html);
});

//panel 

router.route("/panel").get((req, res) => {
    if (!sessionID.user) {
        return res.redirect("/login");
    }
    return res.redirect("/panel/camputes");
});

router.route("/panel/clouds").get((req, res) => {
    if (!sessionID.user) {
        return res.redirect("/login");
    }
    var con = imp(Base["/panel/clouds"]["path"]);
    var panel = panel_parse(req, con);
    html = tag_importer(req, ["", panel, ""]);
    return response(req, res, html);
});

router.route("/panel/camputes").get((req, res) => {
    if (!sessionID.user) {
        return res.redirect("/login");
    }
    var con = imp(Base["/panel/camputes"]["path"]);
    //con = con.replace("{{data-u}}", "data-u='/panel/app/"+ req.session.user._id.toString()+"'");
    var panel = panel_parse(req, con);
    html = tag_importer(req, ["", panel, ""]);
    return response(req, res, html);
});

router.route("/panel/setting").get((req, res) => {
    if (!sessionID.user) {
        return res.redirect("/login");
    }
    var con = imp(Base["/panel/setting"]["path"]);
    var panel = panel_parse(req, con);
    html = tag_importer(req, ["", panel, ""]);
    return response(req, res, html);
});

router.route("/panel/app").post((req, res) => {
    var html ="error";
    if(req.body.setup && sessionID.user){
        if(Panel["setup"][req.body.setup]){
            html = imp(Panel["setup"][req.body.setup]);
        }
        return response(req, res, html);
    }else{
        return res.status(401).send();
    }

});

//user login/register page 
router.route("/register").get((req, res) => {
    if (sessionID.user) {
        return res.redirect("/panel");
    }
    html = tag_importer(req, [imp("header"), imp(Base[req.path].path), imp("footer")]);
    response(req, res, html);
});

router.route("/login").get((req, res) => {
    if (sessionID.user) {
        return res.redirect("/panel");
    }
    html = tag_importer(req, [imp("header"), imp(Base[req.path].path), imp("footer")]);
    response(req, res, html);
});

router.route("/logout").get((req, res) => { res.redirect("/api/auth/logout") });

module.exports = router;
