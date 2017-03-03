// rename to dbmethods.js

var dbmethods = function () {};

dbmethods.insert = function (db, jsonObj) {
  
  // validate db and jsonObj

  var collection = db.collection('urls');
  
  collection.insert(jsonObj, function(err, data) {
    if (err) throw err;
    console.log('record inserted: ' + JSON.stringify(jsonObj));
  });

};

// CANNOT RETURN DATA TO PASS INTO SERVER.JS: http://stackoverflow.com/questions/35246713/node-js-mongo-find-and-return-data

dbmethods.countUrl = function (db) {
  
  var collection = db.collection('counters');  
  
  collection.find({_id:'url_count'}).limit(1).toArray(function(err,results){
    if (err) {
      throw err;
    } else {
      
      if (results.length == 0) {
        // if record doesn't exist, insert and return it
        var record = {
          _id: 'url_count',
          count: 1
        };
        collection.insert(record, function(err,data){
          if (err) throw err;
          console.log('url counter record inserted');
        });
        // console.log('count for after record insert'+record.count);
        var count = record.count;
        db.close();
        return count;
      } else {
        // else increment counter by 1 and return it   
        collection.update({_id:'url_count'},{$inc: {count: +1}});
        var count = results[0]["count"];
        console.log('results array:'+JSON.stringify(results[0]));
        // console.log('count for existing record:'+ count);
        db.close();
        return count;
        
      }
    }
  });
  
};

module.exports = dbmethods;