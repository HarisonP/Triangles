var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stateSchema= new Schema({
  title:  String,
  titleLowerCase: String,
  state:[ {pointA:{x:Number, y:Number},
          pointB:{x:Number, y:Number},
          pointC:{x:Number, y:Number},
          color: String} ]
});

var State = mongoose.model('State', stateSchema);
exports.State = State;