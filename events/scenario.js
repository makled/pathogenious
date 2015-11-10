var User = require("../models/user.js");
var Scenario=require("../models/scenario.js");

exports.init_events = function socket_get_posssible_scenario_gamified(socket) {
    socket.on('get.possible.scenario.gamified', function(info){
        get_posssible_scenario_gamified(info, function(send){
            socket.emit("receive.possible.scenario.gamified", send);
        })
    });
}

var get_posssible_scenario_gamified = exports.get_posssible_scenario_gamified = function get_posssible_scenario_gamified(info, cb) {
    console.log("Point 1")
    var lv = get_random_lv(info.level);
    
    console.log("Point 2")
    Scenario.find({
        'lvl': lv,
        'topic': info.topic
    }, function(err, res) {
        console.log("tottaly got scenarios")
        if (err) return console.log(err);
        User.find({
            '_id': info.id
        }, function(err, users) {
            if (err) return console.log("error getting user to send scenarios ", err);
            var ids = get_user_scenario_ids_by_topic(users[0], info.topic)
            var scen;
            var repeated;
            // var toGet = Math.random() * (res.length);
            // console.log("topic is "+info.topic);
            //  var scen=res[Math.floor(toGet)];
            console.log("Point 3")
            if (info.level > 1) {
                console.log("Point 3.5")
                var b = checkFull(ids, res);

                if (b == false) {
                    console.log("Point 3.5.1")
                    console.log("entered finding step 1");

                    var list = [];

                    for (var i = 0; i < res.length; i++) {
                        if (ids.indexOf(res[i]._id) < 0)
                            list.push(res[i]);

                    }

                    var indexOfScenario = Math.floor(Math.random() * (list.length));
                    scen = list[indexOfScenario];
                    repeated = ids.indexOf(scen._id) < 0 ? false : true;
                    console.log("scenario from step 1 is ", typeof scen === "undefined");
                    console.log("and the repeated is " + repeated);
                    cb({
                        scenario: scen,
                        repeated: repeated
                    });
                }
                else {
                    console.log("Point 3.5.2")
                    var lv2;
                    if (lv == 2)
                        lv2 = 3;
                    else
                        lv2 = 2;
                    console.log("Point 3.5.2", lv2)
                    Scenario.find({
                        "lvl": lv2,
                        'topic': info.topic
                    }, function(err, res2) {
                        if (err) return console.log("error getting scenarios after full randomization ", err);
                        var b2 = checkFull(ids, res2, lv2);
                        if (b2 == false) {
                            console.log("Point 3.5.2.1")

                            var list2 = []

                            for (var i = 0; i < res2.length; i++) {
                                if (ids.indexOf(res2[i]._id) < 0)
                                    list2.push(res2[i]);

                            }

                            var indexOfScenario2 = Math.floor(Math.random() * (list2.length));
                            scen = list2[indexOfScenario2];
                            repeated = ids.indexOf(scen._id) < 0 ? false : true;
                            console.log("scenario from step 2 is ", typeof scen === "undefined");
                            console.log("and the repeated is " + repeated);
                            cb({
                                scenario: scen,
                                repeated: repeated
                            });
                        }
                        else {
                            console.log("Point 3.5.2.2")
                            console.log("entered step 3");
                            Scenario.find({
                                "lvl": 1,
                                'topic': info.topic
                            }, function(err, res3) {
                                if (err) return console.log("error getting scenarions lvl 1 after randomization ", err);
                                var b3 = checkFull(ids, res3, 1);
                                if (b3 == false) {

                                    var list3 = []

                                    for (var i = 0; i < res3.length; i++) {
                                        if (ids.indexOf(res3[i]._id) < 0)
                                            list3.push(res3[i]);

                                    }

                                    var indexOfScenario3 = Math.floor(Math.random() * (list3.length));
                                    scen = list3[indexOfScenario3];
                                    repeated = ids.indexOf(scen._id) < 0 ? false : true;
                                    console.log("scenario from step 3 is ", scen === undefined);
                                    console.log("and the repeated is " + repeated);
                                }
                                else {
                                    var finalIndex = Math.floor(Math.random() * (res.length));
                                    scen = res[finalIndex];
                                    repeated = ids.indexOf(scen._id) < 0 ? false : true;
                                    console.log("scenario from final step is ", scen === undefined);
                                }
                                cb({
                                    scenario: scen,
                                    repeated: repeated
                                });
                            })
                        }
                    })
                }






                // Scenario.find({"topic":info.topic},function(err,result){
                //     if(err) return console.log("error getting scenarios for high lvl gamified ",err);
                //     var found3=false;
                //     var rando3=0;
                //      for(var i=0 ; i < result.length && found3==false ; i++){
                //           rando3 = Math.floor(Math.random() * (result.length));
                //          if(ids.indexOf(result[rando3])==-1)
                //          found3=true;

                //      }
                //      scen=result[rando3];
                //      repeated=ids.indexOf(scen._id)>-1?true:false;
                //      console.log("scenario from big step is ",typeof scen === "undefined");
                // })
                
                
            }
            else {
                console.log("entered base step");
                var toGet = Math.random() * (res.length);
                console.log("topic is " + info.topic);
                scen = res[Math.floor(toGet)];
                repeated = ids.indexOf(scen._id) > -1 ? true : false;
                console.log("scenario from base step is ", typeof scen === "undefined");
                cb({
                    scenario: scen,
                    repeated: repeated
                });
            }

           
        });

    });
}

function get_random_lv(level){
    var random = Math.ceil(Math.random() * 100);
    var lv = 0;
    if (level == 1) {
        if (random >= 0 && random <= 70)
            lv = 1;
        else if (random > 70 && random <= 90)
            lv = 2;
        else
            lv = 3;
    }
    else if (level == 2) {
        if (random >= 0 && random <= 70)
            lv = 3;
        else
            lv = 2;
    }
    else if (level == 3) {
        if (random >= 0 && random <= 90)
            lv = 3;
        else
            lv = 2;
    }
    return lv
}

function get_user_scenario_ids_by_topic(user, topic) {
    var ids;
    if (topic == "Genetics")
        ids = user.answeredScenariosIdsGenetics;
    else if (topic == "Cardiovascular")
        ids = user.answeredScenariosIdsCardio;
    else if (topic == "CNS")
        ids = user.answeredScenariosIdsCNS;
    else if (topic == "BloodCells")
        ids = user.answeredScenariosIdsBloodCells;
   return ids;
}


function checkFull(ids, res, level) {
    var count = 0;
    for (var i = 0; i < res.length; i++) {
        if (ids.indexOf(res[i]._id) > -1)
            count++;
    }
    return count == res.length;
}