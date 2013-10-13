var
  express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , serverPort = 3333
  , groups = Array()
  , SocketClient = require('socket.io-client')
  , Group = require('./../lib/group')
  , SocketServer = require('./../lib/socketServer')(server, groups)
  ;

var serverHost;
/* start server ! */
server.listen(serverPort, function () {
  serverHost = server.address();  
  console.log('Server started at port ', serverHost);
});

describe('Test socket server', function () {

  it('not fail', function (done) {

    // console.log(SocketClient);
    var socketUrl = 'http://localhost:3333/user/';

    var socket = SocketClient.connect(socketUrl, {
        'sync disconnect on unload ': true
    });

    done();
  });

});