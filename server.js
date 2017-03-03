// URL shortener server

// TUTORIAL: https://coligo.io/create-url-shortener-with-node-express-mongo/
// TUTORIAL BASIC: http://lefkowitz.me/thoughts/2016/05/05/men-stack-building-a-url-shortener-with-mongodb-express-and-node-js/

var http = require('http');
var express = require('express');
var mongo = require('mongodb').MongoClient;
var dbmethods = require('./dbmethods.js'); 
var shortenurl = require('./shortenurl.js');

var app = express();
var dburl = 'mongodb://localhost:27017/urldb';

// route: shorten specified url 
app.get('/convert/:targeturl(*)', function (request, response, next) {
  
  var targeturl = request.params['targeturl'];
  // var shortenedurl = shortenurl.shorten(targeturl);
  // console.log('shorturl'+shortenedurl);

  
  // connect to db
  mongo.connect(dburl, function(err, db) {
    if (err) {
      throw err;
    } else {
      
      // grab current counter for unique id incremented from previous count
      
      var count = dbmethods.countUrl(db);
      console.log('main count:'+ count);
      // var shortenedurl = shortenurl.encode(count);
      // console.log('shortenedurl:'+shortenedurl);
      
      var jsonObj = {
        'original-url': targeturl,
        'short-url': ''
      };
      
      /*
      var collection = db.collection('urls');
      // response.end();
      
      // if url in db, then retrieve original url, and redirect; else, insert record into db
      collection.find({'original-url': targeturl}).limit(1).toArray(function(err,documents){
        if (err) {
          throw err;
        } else {
          if (documents.length > 0) {
            console.log("you've already shortened this url");
            console.log(documents[0]);
            db.close();
          } else {
            // insert into db if not in it
            dbmethods.insert(db, jsonObj);
            db.close();
          }
        }
        
        response.end();
      });*/
    }
  });
});


// route: retrieve shortened url and redirect
app.get('/:shortenedurl', function(request,response) {
  var shortenedurl = request.params["shortenedurl"];
  
  mongo.connect(dburl, function(err, db) {
    if (err) throw err;
    
    // find shortenedurl in collection 'urls'
    var collection = db.collection("urls");
    
    collection.find({"short-url": shortenedurl}).toArray(function(err, results){
      if (err) {
        throw err;
      } else {
        
        // if short url record exists, redirect to original url
        if (results.length == 0) {
          console.log('this url does not exist');
          db.close();
        } else {
          var originalUrl = results[0]["original-url"];
          console.log(originalUrl);
          console.log(results);
          db.close();
          
        }
      }
      
      response.redirect(301, originalUrl);
      response.end();
      
    });
  });
  
});


http.createServer(app).listen(process.env.PORT);