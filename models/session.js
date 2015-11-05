var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var Mixed = Schema.Types.Mixed;
var ObjectId = Schema.Types.ObjectId;
var SessionSchema = new Schema({
	user: {
	    ref: 'User',
	    type:ObjectId
	},
	login:[Number],
	logout:[Number],
	durationHours:[Number],
	durationMinutes:[Number],
	durationSeconds:[Number],
	scoreIn:[Number],
	scoreOut:[Number],
	scores:[Number],
	gamified:Boolean
});

var Session =  mongoose.model("Session", SessionSchema);

module.exports = Session;