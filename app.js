var express = require('express');

var app = express();
app.engine('.html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/triangels');
var stateSchema = require('./stateSchema');

app.get('/', function(req, res){
  res.render('canvas.html', { title: 'Hey', message: 'Hello there!'});
  res.end();
});

app.post('/saveCanvas',function(req,res,params){
	var name = req.body.name, 
		state = JSON.parse(req.body.state);

	var newState = stateSchema.State.create({title:name, state:state},function(err,saved){
		if (err) 
			return handleError(err);

		res.setHeader('Content-Type', 'application/json');
    	res.end(JSON.stringify({ success:true, newState:saved}));
	});

	// console.log(name,state);
});
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});