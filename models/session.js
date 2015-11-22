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
		loginGenetics:[Number],
	logoutGenetics:[Number],
	durationHoursGenetics:[Number],
	durationMinutesGenetics:[Number],
	durationSecondsGenetics:[Number],
	scoreInGenetics:[Number],
	scoreOutGenetics:[Number],
	scoresGenetics:[Number],
		loginCardio:[Number],
	logoutCardio:[Number],
	durationHoursCardio:[Number],
	durationMinutesCardio:[Number],
	durationSecondsCardio:[Number],
	scoreInCardio:[Number],
	scoreOutCardio:[Number],
	scoresCardio:[Number],
		loginCNS:[Number],
	logoutCNS:[Number],
	durationHoursCNS:[Number],
	durationMinutesCNS:[Number],
	durationSecondsCNS:[Number],
	scoreInCNS:[Number],
	scoreOutCNS:[Number],
	scoresCNS:[Number],
	loginLiver:[Number],
	logoutLiver:[Number],
	durationHoursLiver:[Number],
	durationMinutesLiver:[Number],
	durationSecondsLiver:[Number],
	scoreInLiver:[Number],
	scoreOutLiver:[Number],
	scoresLiver:[Number],
	gamified:Boolean
});

var Session =  mongoose.model("Session", SessionSchema);

module.exports = Session;