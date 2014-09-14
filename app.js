var express = require('express');

var app = express();
app.engine('.html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/test1');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
//   // yay!
//   console.log('open')
// });


app.get('/', function(req, res){
  res.render('canvas.html', { title: 'Hey', message: 'Hello there!'});
  res.end();
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});