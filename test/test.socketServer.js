var
  // express = require('express')
  // , app = express()
  // , http = require('http')
  // , server = http.createServer(app)
  // , serverPort = 3333
   // groups = Array()
  SocketClient = require('socket.io-client')
  // , Group = require('./../lib/group')
  // , SocketServer = require('./../lib/socketServer')(server, groups)
  ;

// var serverHost;
// /* start server ! */
// server.listen(serverPort, function () {
//   serverHost = server.address();  
//   console.log('Server started at port ', serverHost);
// });

var socketUrl = 'http://localhost:3333/user/';

describe('Test socket server', function () {

  var socket;

  before(function (done){
    this.timeout(20000);
    socket = SocketClient.connect(socketUrl, {
        'sync disconnect on unload ': true
    });

    socket.on('get_unique_id', function (){
        done();
    });
  });


  it('join room which dont exists', function (done) {

    socket.emit('join_room', '11111111');

    socket.on('group_dont_exists', function (){

      done();    
    });


  });

});