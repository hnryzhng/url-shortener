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
app.get('/convert/:targeturl(*)', function (request, response, next) {
  
  var targeturl = request.params['targeturl'];
  var shortenedurl = shortenurl.shorten(targeturl);
  
  var jsonObj = {
    'original-url': targeturl,
    'short-url': shortenedurl
  };
  
  // connect to db
  mongo.connect(dburl, function(err, db) {
    
    console.log('connected to db');
    
    if (err) {
      throw err;
    } else {
      // if url in db (collection.findOne()) then retrieve original url, and redirect; else, insert record into db
      var collection = db.collection('urls');
      var document = collection.find({'original-url': targeturl}).limit(1).toArray(function(err,documents){
        if (err) {
          throw err;
        } else {
          if (documents.length > 0) {
            console.log("you've already shortened this url");
            console.log(documents[0]);
          } else {
            // insert into db if not in it
            dbmethods.insert(db, jsonObj);  // should db.close() after insert
          }
        }
      });
      
    }
  
  });
  
  response.end();
  
});


// router: retrieve shortened url and redirect
// host + shortenedurl
// use or get action
app.use('/shortenedurl', function(request,response){
  var shortenedurl = request.params["shortenedurl"];
  // find shortenedurl in collection 'urls'
  // if not in collection, then return error msg
  // else, retrieve original url, and redirect to it
});


http.createServer(app).listen(process.env.PORT);