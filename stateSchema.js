var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stateSchema= new Schema({
  title:  String,
  state:[{pointA:{x:Number, y:Number},
          pointB:{x:Number, y:Number},
          pointC:{x:Number, y:Number}}]
});

var State = mongoose.model('State', stateSchema);
exports.State = State;