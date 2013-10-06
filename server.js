/* @file server.js */

var 
  express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , socketIO = require('socket.io').listen(server)
  , fs = require('fs')
  , mustache = require('mu2')
  , crc32 = require('crc32')
  , serverProtocol = 'http://'
  , serverHost 
  , serverPort = process.env.PORT || 3333
  , clients = {};
  ;

var SingleWatch = function (initData) {
  
  this.url = initData.url;

  this.watchCount = initData.watchCount;

};
SingleWatch.prototype.getWatchCount = function () {
  return this.watchCount;
};
SingleWatch.prototype.increaseWatchCount = function () {
  this.watchCount++;
};
SingleWatch.prototype.decreaseWatchCount = function () {
  this.watchCount--;
};

mustache.root = __dirname + '/templates';
mustache.clearCache();

// socketIO.set("origins","*:*");
socketIO.set("close timeout",30);
socketIO.set("log level",2);
socketIO.set('transports', ['xhr-polling']);
socketIO.set("polling duration", 60);

app.use(express.logger());
app.use(express.bodyParser());
app.use('/public', express.static(__dirname + "/public"));

/* start server ! */
server.listen(serverPort, function () {
  serverHost = server.address();  
  console.log('Server started at port ', serverHost);
});




function watchSocket (id) {

  var P = socketIO
  .of('/user/'+id)
  .on('connection', function (socket) {

    console.log('Client on socket /user/'+id+' : '+socket.id+' connected.');

    clients[id].increaseWatchCount();

    P.emit('preview', {
      watchCount : clients[id].getWatchCount()
    });

    socket.on('refresh', function () {
      console.log('refresh received on group ',P);
      
      P.emit('refresh', {
        url : clients[id].url
      });

    });

    /*user disconnecting*/
    socket.on('disconnect', function () {

      console.log('socket ',socket.id, 'disconnected function');
      
      clients[id].decreaseWatchCount();

      P.emit('preview', {
        watchCount : clients[id].getWatchCount()
      });
    });

  });

  return P;
}

function renderErrorPage (err, res) {
  
  var 
    params = {}
    , htmlData = ''
  ;

  console.log('/watch, sockets: ',clients)
  params = {
    error : {
      code : err.code,
      message : err.msg
    }
  };

  res.set({
    'Content-Type': 'html',
  });

  mustache.compileAndRender('error_page.html', params)
  .on('error', function (e){
    console.log(e);
    res.send(404);
  })
  .on('data', function (data) {
    htmlData += data;
  })
  .on('end', function () {
    res.send(htmlData.toString());
  });

}


app.get('/', function (req, res) {
  var 
    params = {}
    , htmlData = ''
  ;

  params = {  };

  res.set({
    'Content-Type': 'html',
  });

  mustache.compileAndRender('main_page.html', params)
  .on('error', function (e){
    console.log(e);
    res.send(404);
  })
  .on('data', function (data) {
    htmlData += data;
  })
  .on('end', function () {
    res.send(htmlData.toString());
  });

});

app.get('/preview', function (req, res) {

  console.log('preview request body',req.query);

  var 
    timestamp = new Date().getTime()
    , forHash = req.query.url+timestamp
    , unique_id = crc32(forHash.toString())
    , redirect_url = '/watch/'+unique_id
  ;
  
  new watchSocket(unique_id);

  clients[unique_id] = new SingleWatch({
    url : req.query.url,
    watchCount : 0
  });

  res.redirect(redirect_url);

});

app.get('/watch/:id', function (req, res) {

  console.log('watch request body',req.params.id);

  var 
    params = {}
    , htmlData = ''
    unique_id = req.params.id
  ;

  console.log('/watch, sockets: ',clients);

  if (!clients[unique_id]) {

    var err = {
      code : '404',
      msg : 'No page for watching found! Check your url.'
    };

    return renderErrorPage(err, res);
  }


  params = {
    preview_url : clients[unique_id].url,
    unique_id : unique_id,
    server_address : serverProtocol+serverHost+':'+serverPort+'/user/'+unique_id
  };

  res.set({
    'Content-Type': 'html',
  });

  mustache.compileAndRender('client.html', params)
  .on('error', function (e){
    console.log(e);
    res.send(404);
  })
  .on('data', function (data) {
    htmlData += data;
  })
  .on('end', function () {
    res.send(htmlData.toString());
  });

});