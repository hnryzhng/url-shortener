// URL shortener 

var http = require('http');
var express = require('express');
var url = require('url');
var mongo = require('mongodb').MongoClient;
var dbmethods = require('./dbmethods.js'); 
var shortenurl = require('./shortenurl.js');

var app = express();
var dburl = 'mongodb://localhost:27017/urldb';

// route: shorten specified url 
app.get('/convert/:targeturl(*)', function (request, response, next) {
  
  var targeturl = request.params['targeturl'];  // || post request from form body 

  // VALIDATE URL FORMAT
  var urlobj = url.parse(targeturl);
  if (urlobj.host == null) {
      response.end('not a valid url');
      throw Error('not a valid url');
  } else {
      targeturl = urlobj.href;
  }

  // CONNECT TO DB
  mongo.connect(dburl, function(err, db) {
    if (err) {
      throw err;
    } else {
    
      // if url in urls collection, then retrieve original url, and redirect; else, shorten url and insert record into db
      var collection = db.collection('urls');
      /*
      collection.remove({}, function(err,data){
        if (err) throw err;
        console.log('removed all from collection:');
      });
      */
      
      collection.find({'original-url': targeturl}).limit(1).toArray(function(err,documents){
        if (err) {
          throw err;
        } else {
          if (documents.length > 0) {
            console.log("you've already shortened this url");
            response.end('your shortened url: '+ request.protocol + '://' + request.host+'/'+documents[0]['short-url']);
          } else {
            // grab current counter for unique id incremented from previous count
            dbmethods.countUrl(db, function callback(count){
              // console.log('main count: '+ count);
              var shortenedurl = shortenurl.encode(count);
              // console.log('shortenedurl:'+shortenedurl);
              var jsonObj = {
                'original-url': targeturl,
                'short-url': shortenedurl,
                _id: count
              };
              // console.log('jsonObj:'+JSON.stringify(jsonObj));
                            
              // insert into db if not in it
              dbmethods.insert(db, jsonObj);
              
              db.close();
              response.end('your shortened url: '+ request.protocol + '://' +request.host+'/'+jsonObj['short-url']);
              
            });
  
          }
        }

      });

    } 
  }); // close mongo.connect()
});


// route: retrieve shortened url and redirect
app.get('/:shortenedurl', function(request,response) {
  var shortenedurl = request.params["shortenedurl"];
  
  // CONNECT TO DB
  mongo.connect(dburl, function(err, db) {
    if (err) throw err;
    
    // DEFINE findRedirect()
    // need this for callback to response redirect using original url after using collection.find(), an async operation (ref: dbmethods.js)
    function findRedirect(callback){ 
      // find shortenedurl in collection 'urls'
      var collection = db.collection("urls");
      
      collection.find({'short-url':shortenedurl}).limit(1).toArray(function(err, results){
        if (err) {
          throw err;
        } else {
          
          // if short url record exists, redirect to original url
          if (results.length == 0) {
            response.end('this url does not exist');
          } else {
            var originalUrl = results[0]['original-url'];
            console.log('originalurl:'+originalUrl);
            console.log('results:'+JSON.stringify(results));
            return callback(originalUrl);
          }
        }
        db.close();
        
      });
    } // end findRedirect()
    
    // CALL findRedirect()
    findRedirect(function callback(originalUrl){
      console.log('redirected to: '+originalUrl);
      response.redirect(originalUrl);
      response.end();
    });

  }); // close mongo.connect()
  
});


http.createServer(app).listen(process.env.PORT);