var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var Mixed = Schema.Types.Mixed;
var ObjectId = Schema.Types.ObjectId;
var choice={
	text:String,
	hint:String,
	correct:Boolean};
	var room={
		name: String,
	text: String,
	choices: [Mixed],
	ksf: [String],
	hint: String,
	score: Number
	}
var ScenarioSchema = new Schema({
	topic:String,
    lvl: Number,
	ini: Mixed,
	rooms: [Mixed],
	end:[Mixed]
});

var Scenario =  mongoose.model("Scenario", ScenarioSchema);

module.exports = Scenario;
