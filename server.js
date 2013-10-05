/* @file server.js */

var 
  express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , socketIO = require('socket.io').listen(server)
  , fs = require('fs')
  , mustache = require('mu2')
  , serverProtocol = 'http://'
  , serverHost 
  , serverPort = process.env.PORT || 3333
  , clients = {};
  ;


mustache.root = __dirname + '/templates';
mustache.clearCache();

// socketIO.set("origins","*:*");
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


    P.emit('preview - new ');

    socket.on('refresh', function () {
      console.log('refresh received on group ',P);
      P.emit('refresh', {url : clients[id].url});
    });

    /*user disconnecting*/
    socket.on('disconnect', function () {

      console.log('socket ',socket.id, 'disconnected function');

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

function getBookmarklet () {
  fs.readFile('./bookmarklet/passb.js', function (err, data) {

    if (err) {
      res.send(404);
      throw err;
    }

  });
}

app.get('/', function (req, res) {
  var 
    params = {}
    , htmlData = ''
  ;

  params = {};

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
    , unique_id = timestamp
    , redirect_url = '/watch/'+unique_id
  ;
  
  new watchSocket(unique_id);

  clients[unique_id] = {
    url : req.query.url
  };

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
      msg : 'No page for watching found! Check your url'
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