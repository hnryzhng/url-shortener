var crypto = require('crypto');   // for hashing target url

var ShortenUrl = function() {};

ShortenUrl.shorten = function(targeturl) {
    
    // hash targeturl
    
    var shortenedurl = crypto
    .createHash('sha1')
    .update(targeturl)
    .digest('hex');
    
    console.log('shortened: ' + shortenedurl.toString());
    return shortenedurl.toString();
};

ShortenUrl.encode = function (num) {
    
    // convert unique id counter into a shorter string for shortened url 
    // (id counter ensures uniqueness instead of using a hash to generate unique string)
    // reference: https://coligo.io/create-url-shortener-with-node-express-mongo/
    
    // 1. create counter of a global auto-incremented integer to keep track of total records (store in counters collection)
    // 2. for each record, have the current count become the unique id (base 10)
    // 3. convert that unique id to shorter string (base 58), store as shortened url
    
    // base 10 num to base 58
    num = parseInt(num,10);
    
    var characters = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'; // excluded 0, I, l, O to avoid confusion
    var base = characters.length;
    var encodedStr = '';

    while (num) {
        var charIndex = num % base; // remainder for index of char (maps digit to character position)
        num = Math.floor(num/base); // divide num by base for further loop processing
        encodedStr = characters[charIndex].toString() + encodedStr;    // add encodedStr char to encodedStr string
    }
    
    console.log('encodedStr:'+encodedStr);
    return encodedStr;
};

ShortenUrl.decode = function (encodedStr) {
    
    // decode base 58 to base 10 to get unique id for record containing original url
    var characters = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    var num = 0;
    var base = characters.length;   // base 58
    var power = encodedStr.length-1;
    var digitVal = 0;
    
    for (var i=0; i<encodedStr.length; i++) {
        var c = encodedStr.charAt(i);
        // console.log('char:'+c);
        var charIndex = characters.indexOf(c);
        // console.log('index:'+charIndex);
        digitVal = charIndex * Math.pow(base, power);
        // console.log('base'+base);
        // console.log('power:'+power);
        // console.log('digitval:'+digitVal);
        power -= 1;
        num += digitVal;
        // console.log('num:'+num.toString());
        // console.log('-----');
    }
    
    // console.log(num);
    return num;
};


module.exports = ShortenUrl;