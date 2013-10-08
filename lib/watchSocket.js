var socketIO = require('socket.io');

var WatchSocket = function (server, clients) {

  var socketServer = socketIO.listen(server);
  // socketIO.set("origins","*:*");
  socketServer.set("close timeout",30);
  socketServer.set("log level",2);
  socketServer.set('transports', ['xhr-polling']);
  socketServer.set("polling duration", 60);
  


  var S = socketServer
  .of('/user/')
  .on('connection', function (socket) {

    socket.emit('get_unique_id')
    socket.on('get_unique_id', function (uid) {

      socket.join(uid);
      console.log('Client joined room'+uid+' : '+socket.id+' connected.');
      
      // clients[uid].increaseWatchCount();
      console.log('================== '+ clients[uid].url);
      console.log('open: ',socket.manager.open, 'closed: ', socket.manager.closed);

      socketServer.sockets.in(clients[uid]).emit('preview', {

        watchCount : clients[uid].getWatchCount()
        // watchCount : socket.manager.open
      });

      socket.on('refresh', function () {
        console.log('refresh received on group ',S);
        
        socketServer.sockets.in(clients[uid]).emit('refresh', {
          url : clients[uid].url
        });

      });
    });



    /*user disconnecting*/
    // socket.on('disconnect', function () {

    //   console.log('socket ',socket.id, 'disconnected function');
      
    //   clients[unique_id].decreaseWatchCount();
    //   socket.leave(unique_id);

    // });

  });

  // return SocketGroup;
};

module.exports = WatchSocket;