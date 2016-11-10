var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var StatsSchema = new Schema({
    id:String,
    name:String,
    registered:Boolean,
    gamified:Boolean,
    score:Number,
    totalDuration:Number,
    durationBeforeQuiz2:Number,
    durationBeforeQuiz2day:Number,
    durationBeforeQuiz3:Number,
    durationBeforeQuiz3day:Number,
    durationBeforeFinal:Number,
    durationBeforeFinalday:Number,
    quiz2Grade:Number,
    quiz3Grade:Number,
    finalGrade:Number,
    group:Number
});

var Stats =  mongoose.model("Stats", StatsSchema);

module.exports = Stats;