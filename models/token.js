var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var Mixed = Schema.Types.Mixed;
var ObjectId = Schema.Types.ObjectId;
var ScenarioSchema = new Schema({
	user: {
	    ref: 'User',
	    type:ObjectId
	}
});

var User =  mongoose.model("Token", ScenarioSchema);

module.exports = User;
