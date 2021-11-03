var config = {
	username:'root',
	Password:'haza,1967049Ad',
	host:sshServer,
	port:22,
	dstHost:destinationServer,
	dstPort:27017,
	localHost:'127.0.0.1',
	localPort: 27000
  };

  var tunnel = require('tunnel-ssh');
  tunnel(config, function (error, server) {
	server.console("merhaba rrbot naber amk")
  });