var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Mixed = Schema.Types.Mixed;
var ObjectId = Schema.Types.ObjectId;
var RoomSchema = new Schema({
	name: String,
	text: String,
	choices: [{type:ObjectId,ref:'Choice'}],
	ksf: [String],
	hint: String,
	score: Number
});

var Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
