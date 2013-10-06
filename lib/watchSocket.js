var socketIO = require('socket.io');

var WatchSocket = function (server){

  var socketServer = socketIO.listen(server);
  // socketIO.set("origins","*:*");
  socketServer.set("close timeout",30);
  socketServer.set("log level",2);
  socketServer.set('transports', ['xhr-polling']);
  socketServer.set("polling duration", 60);
  
  var SocketGroup = function (clients, unique_id) {

    var S = socketServer
    .of('/user/'+unique_id)
    .on('connection', function (socket) {

      console.log('Client on socket /user/'+unique_id+' : '+socket.id+' connected.');

      clients[unique_id].increaseWatchCount();

      S.emit('preview', {
        watchCount : clients[unique_id].getWatchCount()
      });

      socket.on('refresh', function () {
        console.log('refresh received on group ',P);
        
        S.emit('refresh', {
          url : clients[unique_id].url
        });

      });

      /*user disconnecting*/
      socket.on('disconnect', function () {

        console.log('socket ',socket.id, 'disconnected function');
        
        clients[unique_id].decreaseWatchCount();

        S.emit('preview', {
          watchCount : clients[unique_id].getWatchCount()
        });
      });

    });

  };
  return SocketGroup;
}
module.exports = WatchSocket;