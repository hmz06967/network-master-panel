const db = require("./restapi/database/db")
const apiKeyAuth = require('api-key-auth');
var error = { stat: "error", msg: "bir hata oluştu" };

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
            message: "Api key true",
            data: data
        });
    }
}

var setApiKey = (params)=> {
    const apiKeys = new Map();
    apiKeys.set(params.uid, {
        id: 2,
        name: 'app2',
        secret: 'secret2'
    });
}

var getSecret = (keyId, done) =>{
  if (!apiKeys.has(keyId)) {
    return done(new Error('Unknown api key'));
  }
  const clientApp = apiKeys.get(keyId);
  done(null, clientApp.secret, {
    id: clientApp.id,
    name: clientApp.name
  });
}

module.exports = {
    cloud,
    err,
    res
}
