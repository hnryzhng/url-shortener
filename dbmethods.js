// rename to dbmethods.js

var dbmethods = function () {};

dbmethods.insert = function (db, jsonObj) {
  
  // validate db and jsonObj

  var collection = db.collection('urls');
  
  collection.insert(jsonObj, function(err, data) {
    if (err) throw err;
    console.log('record inserted: ' + JSON.stringify(jsonObj));
  });
  
  db.close();
};


module.exports = dbmethods;