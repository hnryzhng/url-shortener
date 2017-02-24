var crypto = require('crypto');   // for hashing target url

var ShortenUrl = function() {};

ShortenUrl.shorten = function(targeturl) {
    
    // shorten targeturl (hash or key index)
    // reference (instructive comments): https://blog.codinghorror.com/url-shortening-hashes-in-practice/
    
    var shortenedurl = crypto
    .createHash('sha1')
    .update(targeturl)
    .digest('hex');
    
    console.log('shortened: ' + shortenedurl.toString());
    return shortenedurl.toString();
}

module.exports = ShortenUrl;