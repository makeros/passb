/* @file server.js */

var 
  express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , socketIO = require('socket.io').listen(server)
  , fs = require('fs')
  , mustache = require('mu2')

  , serverPort = process.env.PORT || 3333
  , sockets = {};
  ;

mustache.root = __dirname + '/templates';
mustache.clearCache();

socketIO.set("origins","*:*");
socketIO.set("log level",2);
socketIO.set('transports', ['xhr-polling']);
socketIO.set("polling duration", 60);

function watchSocket (id) {

  var P = socketIO
  .of('/user/'+id)
  .on('connection', function (socket) {

    console.log('Client on socket /user/'+id+' : '+socket.id+' connected.');


    P.emit('preview - new ');

    socket.on('refresh', function () {
      console.log('refresh received on group ',P);
      P.emit('refresh', {url : sockets[id].url});
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

  console.log('/watch, sockets: ',sockets)
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

app.get('/get-client/bookmarklet', function (req, res) {

  fs.readFile('./bookmarklet/passb.js', function (err, data) {
    if (err) {
      res.send(404);
      throw err;
    }
    
    res.set({
      'Content-Type': 'text/javascript',
    });

    res.send(data);

  });

});

app.get('/get-client/socket-io-client', function (req, res) {

  fs.readFile('./node_modules/socket.io-client/dist/socket.io.min.js', function (err, data) {
    if (err) {
      res.send(404);
      throw err;
    }
    
    res.set({
      'Content-Type': 'text/javascript',
    });
    
    res.send(data);

  });

});




app.get('/preview', function (req, res) {

  console.log('preview request body',req.query);


  var 
    timestamp = new Date().getTime()
    , unique_id = timestamp
    ,redirect_url = 'http://localhost:3333/watch/'+unique_id
  ;
  
  new watchSocket(unique_id);

  sockets[unique_id] = {
    url : req.query.url
  };

  //res.header('Content-Length', redirect_url.length);
  res.redirect(redirect_url);
  //res.end(redirect_url);


});

app.get('/watch/:id', function (req, res) {

  console.log('watch request body',req.params.id);

  var 
    params = {}
    , htmlData = ''
    unique_id = req.params.id
  ;

  console.log('/watch, sockets: ',sockets);

  if (!sockets[unique_id]) {

    var err = {
      code : '404',
      msg : 'No page for watching found! Check your url'
    };

    return renderErrorPage(err, res);
  }


  params = {
    preview_url : sockets[unique_id].url,
    unique_id : unique_id
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


/* start server ! */
server.listen(serverPort);
console.log('Server started at port '+serverPort);