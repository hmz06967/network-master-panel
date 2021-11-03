module.exports = (app)=>{
    let session = require('express-session');
    let FileStore = require('session-file-store')(session);
    let uuid = require('uuid').v4;

    app.use(session({
        genid: (req) => {
            return uuid() // use UUIDs for session IDs
        },
        store: new FileStore({ logFn: function () { } }),
        secret: 'session-chiamaster-391048526731b-506993',
        resave: false,
        saveUninitialized: true
    }));

    return app;
} 