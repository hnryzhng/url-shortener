// URL shortener server

// TUTORIAL: https://coligo.io/create-url-shortener-with-node-express-mongo/
// TUTORIAL BASIC: http://lefkowitz.me/thoughts/2016/05/05/men-stack-building-a-url-shortener-with-mongodb-express-and-node-js/

var http = require('http');
var express = require('express');
var path = require('path');

var mongo = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/urldb';
var dbmethods = require('./dbmethods.js'); 

var shortenurl = require('./shortenurl.js');

var app = express();

// router: shorten specified url 

app.get('/:targeturl(*)', function (request, response, next) {
  
  var targeturl = request.params['targeturl'];
  var shortenedurl = shortenurl.shorten(targeturl);
  
  var jsonObj = {
    'original-url': targeturl,
    'short-url': request.host + '/' + shortenedurl  
  };
  
  // connect to db
  mongo.connect(dburl, function(err, db) {
    if (err) throw err;
    console.log('connected to db');
    // else if check if url in db (collection.findOne()) then next(), if not then insert into db
    dbmethods.insert(db, jsonObj);
    db.close();
  });
  
  response.write(targeturl);
  // response.json(jsonCollection);
  response.end();
  
});


// router: retrieve shortened url and redirect
// host + shortenedurl


http.createServer(app).listen(process.env.PORT);