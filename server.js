/* @file server.js */

var 
  express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)

  , fs = require('fs')
  , mustache = require('mu2')
  , crc32 = require('crc32')
  , utils = require('./lib/utils.js')

  , serverPort = process.env.PORT || 3333
  , groups = Array()
  , Group = require('./lib/group')
  , SocketServer = require('./lib/socketServer')(server, groups)
  ;


mustache.root = __dirname + '/templates';
mustache.clearCache();

// app.use(express.logger());
app.use(express.bodyParser());
app.use('/public', express.static(__dirname + "/public"));

/* start server ! */
server.listen(serverPort, function () {
  serverHost = server.address();  
  // console.log('Server started at port ', serverHost);
});

function renderErrorPage (err, res) {
  
  var 
    params = {}
    , htmlData = ''
  ;

  console.log('/watch, sockets: ',groups)
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
  console.log('=====pages view count : ', utils.objLength(groups), groups);

  mustache.clearCache();

  params = { 
    activePagesCount : utils.objLength(groups)
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

/*called only once!*/
app.get('/preview', function (req, res) {

  console.log('preview request body',req.query);

  var 
    timestamp = new Date().getTime()
    , forHash = req.query.url+timestamp
    , unique_id = crc32(forHash.toString())
    , redirect_url = '/watch/'+unique_id
  ;
  
  groups[unique_id] = new Group({
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

  console.log('/watch, sockets: ',groups);

  if (!groups[unique_id]) {

    var err = {
      code : '404',
      msg : 'No page for watching found! Check your url.'
    };

    return renderErrorPage(err, res);
  }


  params = {
    preview_url : groups[unique_id].url,
    unique_id : unique_id,
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