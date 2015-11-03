var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ChoiceSchema = new Schema({
   	text:String,
	hint:String,
	correct:Boolean,
});

var Choice =  mongoose.model("Choice", ChoiceSchema);

module.exports = Choice;