const http = require('http');
const express = require('express');
const app = express();
var io = require('socket.io')(server);
var cors = require('cors');
var server = app.listen(3000);
var io = require('socket.io')(server);
var path = require('path');
var SSHClient = require('ssh2').Client;

app.use(cors({
    origin: '*'
  }));

const error = {};
var access_data = {
    ip: null,
    user: null,
    passw: null
};
var error_code= 3;
var msg = {
    "status":["error","ok","fail","error","warning","error"],
    "ssh-connect": [
        "Bağlantı hatası!.",
        "Bağlantı kuruldu.",
        "Bir hata oluştu.",
        "Access denied.",
        "Bağlantı koptu",
        "Lütfen geçerli bir ip adresi girin.!"
    ]
}

//ssh connect
var ssh_coonn = function(access_data){
    error_code=0;
        var conn = new SSHClient();

        conn.on('ready', function () {
            error_code=-1;
            socket.emit('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');
            conn.shell(function (err, stream) {
                if (err)
                    return socket.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
                socket.on('data', function (data) {
                    stream.write(data);
                });
                stream.on('data', function (d) {
                    socket.emit('data', d.toString('binary'));
                }).on('close', function () {
                    conn.end();
                });
            });
            console.log("bağlantı kuruldu");
            error_code = 1;
            
        }).on('close', function () {
            error_code=5;
            socket.emit('data', '\r\n*** ssh bağlandı ***\r\n');
        }).on('error', function (err) {
            error_code=3;
            socket.emit('data', '\r\n*** Bağlantı hatası! ' + err.message + ' ***\r\n');
        }).connect({
            host: access_data.ip,
            username: access_data.user,
            password: access_data.passw
        });

    return sflag; 
}

var validIP = function(i) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(i);
}

io.on('connection', function (socket) {
    var sflag = 0, code = 3;
    console.log("soket bağlantısı var!")
    socket.on("access_data", function (data) {
        if(validIP(data.ip)){
            if(typeof data.user =="String" &&
            typeof data.passw =="String"){
                code = ssh_coonn(access_data)    
            }
        }else{
            code = 4;
        } 
    });
});

console.log("soket çalışıyor..")