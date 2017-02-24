// URL shortener server

// TUTORIAL: https://coligo.io/create-url-shortener-with-node-express-mongo/
// TUTORIAL BASIC: http://lefkowitz.me/thoughts/2016/05/05/men-stack-building-a-url-shortener-with-mongodb-express-and-node-js/

var http = require('http');
var express = require('express');
var path = require('path');

var mongo = require('mongodb').MongoCLient;
var dburl = "mongodb://localhost:27017/urldb";
var dbmethods = require('./dbmethods.js'); 

var app = express();

// router: shorten specified url 
app.get('/shorten/:targeturl(*)', function (request, response, next) {
  
  // connect to db
  mongo.connect(dburl, function(err, db) {
    if (err) {
      throw err;
    } else {
      console.log('connected to db');
      // else if check if url in db (collection.findOne()) then next(), if not then insert into db
      // dbmethods.insert(db, targeturl);
      db.close();
    }
    
  });
  
  var targeturl = request.params['targeturl'];
  
  // response.json(jsonCollection);
  response.end(targeturl);
  
});


// router: retrieve shortened url and redirect
// host + shortenedurl


http.createServer(app).listen(process.env.PORT);