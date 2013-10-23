var 
  socketIO = require('socket.io')
  , serverPort = process.env.PORT || 3333

  , utils = require('./utils')
  , express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  ;

// app.use(express.logger());
app.use(express.bodyParser());
app.use('/public', express.static(__dirname + "/../public"));

/* start server ! */
server.listen(serverPort, function () {
  serverHost = server.address();  
  // console.log('Server started at port ', serverHost);
});


var SocketServer = function (groups ) {

  var io = socketIO.listen(server);
  // socketIO.set("origins","*:*");

  io.configure('production', function (){

    console.log('socketIO production config loaded');

    io.set("log level" , 0);

  });

  io.configure('test', function (){
    console.log('socketIO test config loaded');
    
    io.set("log level" , 0);
    
  });
  io.set("transports" , ['websocket','xhr-polling']);
  io.set("pooling duration" , 10);
  io.set("close timeout" , 3600);

  var S = io
  .of('/user/')
  .on('connection', function (socket) {

    var unique_id;
    socket.emit('get_unique_id');

    /*TODO: check if uid exists in clients*/

    socket.on('join_room', function (uid) {

      if (!groups[uid]) {
        return socket.emit('group_dont_exists')
      }

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
      // console.log('clients in room: ', io.of('/user/').clients(uid));

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
    socket.on('disconnect', function () {

      // console.log('socket ',socket.id, 'disconnected function');
      // console.log('open: ',io.of('/user/').clients(unique_id));
      

      if (groups[unique_id]){

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

      }
      else {
        console.log('lone socket disconnected, uid: ', unique_id);
      }

    });

  });

  // return SocketGroup;
};

module.exports = SocketServer;
module.exports.app = app;