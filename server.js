var express = require('express');
var app = express();
var url = require('url');
var fs = require('fs');
var validator = require('valid-url');
var dirty = require('dirty');
var db = dirty('url.db');

var count = 1001;

app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var fileStream = fs.createReadStream('index.html');
    fileStream.pipe(res);
});

app.get('/new/:url*', function(req, res) {
 //   console.log('new');
    var url = req.url.slice(5);
    if(!validator.isUri(url)) {
        res.write(JSON.stringify({'error' : 'Invalid Url format'}));
        res.end();
        return
    }

    if(typeof(db.get(url)) == 'undefined') {
        db.set(count.toString(), url);
        console.log('write ' + url + '  db');
        hash = count;
        count += 1;
    } else {
        hash = db.get(url);
    }
    var shorturl = 'https://ancient-everglades-90384.herokuapp.com' + hash.toString();
    res.write(JSON.stringify({'short-url' : shorturl}));
    res.end()

});

app.get('/:url', function(req, res) {
 //   console.log('redirect');
    var url = req.url.slice(1);
    if(url == 'favicon.ico') {
        return
    }
    resolve = db.get(url)
    console.log(resolve)

    if(typeof(resolve) == 'undefined') {
        res.write(JSON.stringify({'error' : 'unknown short-url'}));
        res.end();
    }

    res.redirect(resolve);
    res.end();
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Example app listening on port 3000')
});
