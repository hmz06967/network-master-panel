
var fs = require('fs');

var Panel = {
    "path":"panel",
    "header":false,
    "footer":false,
    "title":"Dashboard - Chia Master",
    "settings":{
        "leftbar":"panel/left-nav-bar",
        "topbar":"",
        "container":"panel/camputes"
    },
    "camputes":{
        "path":"panel/camputes",
        "title":"Makineler - Chia Master"
    },
    "clouds":{
        "path":"panel/clouds",
        "title":"Makineler - Chia Master"
    }   
}

var Base = {
    "/":{
        "path":"index-page",
        "title":"Chia Master - Arsa Yükleyici"
        }, 
    "/panel": Panel,
    "/login":{
        "path":"login",
        "title":"Giriş Yap - Chia Master"
    },
    "/register":{
        "path":"register",
        "title":"Kayıt Ol - Chia Master"
    },
    "/price":{
        "path":"price",
        "title":"Limitler & Ücretler - Chia Master"
    },
    "/faq":{
        "path":"faq",
        "title":"Sıkça Sorulan Sorular- Chia Master"
    }
};

const imp = function(file) {
    var src = "src/html/"
    var filepath = src + file + ".html";
    if (fs.existsSync(filepath)) 
        return fs.readFileSync(filepath,"UTF-8");
    return "";
}

var tag_importer = function (req, core) {
    var base = body_parse(req);
    var cor_array = ["{{header}}","{{body}}","{{footer}}"];
    for(var i in core){
        base = base.replace(cor_array[i], core[i]);
    }
    return base;
}

var body_parse =  function(req) {
    var body = imp("index"); 
    return body.replace("{{title}}", Base[req.path].title);
}

var panel_parse = function (req) {
    var panel = imp("panel");
    var body_set =  Panel["settings"];
    panel = panel.replace("{{left-nav-bar}}", imp(body_set["leftbar"]));
    panel = panel.replace("{{panel-container}}", imp(body_set["container"]));
    return panel;
}

var response = function (req, res, html, tp) {

    var type = 'text/html',
        code = 200;
        ///res.end(JSON.stringify(req.headers));
   /* if (!Object.hasOwnProperty.call(req.cookies, "user_login")) {    
        res.end();
    }*/
     if(tp == 'json'){
        type ='aplication/json';
        res.writeHead(code, {'Content-Type': type});
        return res.json(JSON.stringify(html)); 
    }
   
    res.writeHead(code, {'Content-Type': type});
    return res.end(html);
}

for(var i in Base){ 
    app.get(i, function (req, res) {
        if(req.method=="GET"){
            var html="is not good";

            if(req.baseUrl=="/api"){   

            }
            //else if(req.baseUrl=="/panel"){
             
            if(true){
                console.log(req.path);
                var panel = panel_parse(req); 
                html = tag_importer(req, ["", panel, ""]);
            }else{
                html = tag_importer(req, [imp("header"), imp(Base[req.path].path), imp("footer")]);
            }
            return response(req, res, html);
        }
    });
}

var get_msg= function(r, s, t) {
    var msg = {
        "status":["error","ok"],
        "ssh-connect": [
            "Bağlantı hatası!.",
            "Bağlantı kuruldu.",
            "Bir hata oluştu.",
            "Access denied.",
            "Lütfen geçerli bir ip adresi girin.!"
        ]
    }
    var xcode = {
        "status":msg[s],
        "message":msg[t][s],
        "response":r,
        "type":t
    }
    return  xcode;
}
