var 
  socketIO = require('socket.io')
  , utils = require('./utils')
  ;

var SocketServer = function (server, groups) {

  var io = socketIO.listen(server);
  // socketIO.set("origins","*:*");
  io.set("close timeout",20);
  io.set("log level",2);
  io.set('transports', ['xhr-polling']);
  io.set("polling duration", 10);
  


  var S = io
  .of('/user/')
  .on('connection', function (socket) {

    var unique_id;
    socket.emit('get_unique_id');

    /*TODO: check if uid exists in clients*/

    socket.on('join_room', function (uid) {

      unique_id = uid;

      socket.join(uid);


      try{
        
        groups[uid].increaseCount();
        console.log('Client joined room'+uid+' : '+socket.id+' connected.');
      
        console.log('================== '+ groups[uid].url);
        // console.log('open: ',socket.manager.open, 'closed: ', socket.manager.closed);
      }
      catch (e){

      }
      
      // var clientsInRoom = io.of('/user/').clients(uid)
      // io.sockets.in(uid).emit('preview', {
      // console.log('all rooms: ', io.sockets.manager.rooms); 
      console.log('clients in room: ', io.of('/user/').clients(uid));

      // var watchersCount = utils.objLength(socket.manager.open)  ;
      // var watchersCount = clientsInRoom.length  ;

      socket.broadcast.to(uid).emit('preview', {

        watchCount : groups[uid].getCount()
      });

      socket.emit('preview', {

        watchCount : groups[uid].getCount()
      });
    });

    socket.on('refresh', function (uid) {

      console.log('refresh received on group ');
      
      socket.broadcast.to(uid).emit('refresh', {
        url : groups[uid].url
      });

      socket.emit('refresh', {
        url : groups[uid].url
      });

    });


    /*user disconnecting*/
    socket.on('disconnect', function (d) {

      console.log('socket ',socket.id, 'disconnected function');
      console.log('open: ',io.of('/user/').clients(unique_id));
      
      groups[unique_id].decreaseCount();
      socket.leave(unique_id);
      // var clientsInRoom = io.of('/user/').clients(unique_id);
      var watchersCount = groups[unique_id].getCount();

      if (watchersCount <= 0) {
        delete groups[unique_id];
      }

      socket.broadcast.to(unique_id).emit('preview', {
        watchCount : watchersCount
      });

    });

  });

  // return SocketGroup;
};

module.exports = SocketServer;