/* @file server.js */

var 
  express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)

  , fs = require('fs')
  , mustache = require('mu2')
  , crc32 = require('crc32')

  , SingleWatch = require('./lib/singleWatch')
  , WatchSocket = require('./lib/watchSocket')(server)

  , serverProtocol = 'http://'
  , serverHost 
  , serverPort = process.env.PORT || 3333
  , clients = Array();
  ;



mustache.root = __dirname + '/templates';
mustache.clearCache();



app.use(express.logger());
app.use(express.bodyParser());
app.use('/public', express.static(__dirname + "/public"));

/* start server ! */
server.listen(serverPort, function () {
  serverHost = server.address();  
  console.log('Server started at port ', serverHost);
});

function objectLength(obj) {
  var result = 0;
  for(var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
    // or Object.prototype.hasOwnProperty.call(obj, prop)
      result++;
    }
  }
  return result;
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
  console.log('=====pages view count : ', objectLength(clients), clients);
  params = { 
    activePagesCount : objectLength(clients)
  };

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
  
  WatchSocket(clients, unique_id);

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