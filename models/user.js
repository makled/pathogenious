var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var Mixed = Schema.Types.Mixed;
var ObjectId = Schema.Types.ObjectId;
var ScenarioSchema = new Schema({
	displayName:String,
	userName:String,
	id:String,
	tutorial:{
	 type:Number,
	 default:0
	},
	dailyStreak:{
	 type:Number,
	 default:0
	},
	dailySkip:{
	 type:Number,
	 default:3
	},
	socketId:{
	 type:String,
	 default:""
	},
	password:String,
    totalScore:{
        
     type: Number,
     default:0
    },
    geneticsScore:{
     type:Number,
     default:0
    },
    cardioScore:{
     type:Number,
     default:0
    },
    cnsScore:{
     type:Number,
     default:0
    },
    bloodCellsScore:{
     type:Number,
     default:0
    },
    liverScore:{
     type:Number,
     default:0
    },
    level:{
     type:Number,
     default:1
    },
    geneticsLevel:{
     type:Number,
     default:1
    },
    cardioLevel:{
     type:Number,
     default:1
    },
    cnsLevel:{
     type:Number,
     default:1
    },
    bloodCellsLevel:{
     type:Number,
     default:1
    },
    liverLevel:{
     type:Number,
     default:1
    },
    verified:{
      type:Boolean,
      default:false
    },
    correctScenarios:{
        
     type: Number,
     default:0
    },
    answeredQuestions:{
        
     type: Number,
     default:0
    },
    correctQuestions:{
        
     type: Number,
     default:0
    },
    answeredQuestionsCardio:{
        
     type: Number,
     default:0
    },
    correctQuestionsCardio:{
        type:Number,
    
        default: 0
    },
    correctScenariosCardio:{
     type:Number,
     default:0
    },
    answeredQuestionsGenetics:{
        
     type: Number,
     default:0
    },
    correctQuestionsGenetics:{
        type:Number,
    
        default: 0
    },
    correctScenariosGenetics:{
     type:Number,
     default:0
    },
    answeredQuestionsCNS:{
        
     type: Number,
     default:0
    },
    correctQuestionsCNS:{
        type:Number,
    
        default: 0
    },
    correctScenariosCNS:{
     type:Number,
     default:0
    },
    answeredQuestionsBloodCells:{
        
     type: Number,
     default:0
    },
    correctQuestionsBloodCells:{
        type:Number,
    
        default: 0
    },
    correctScenariosBloodCells:{
     type:Number,
     default:0
    },
    answeredQuestionsLiver:{
        
     type: Number,
     default:0
    },
    correctQuestionsLiver:{
        type:Number,
    
        default: 0
    },
    correctScenariosLiver:{
     type:Number,
     default:0
    },
	answeredScenariosIdsGenetics:{
	    type:[Mixed],
	    default:[]
	},
	answeredScenariosIdsCardio:{
	    type:[Mixed],
	    default:[]
	},
	answeredScenariosIdsCNS:{
	    type:[Mixed],
	    default:[]
	},
	answeredScenariosIdsBloodCells:{
	    type:[Mixed],
	    default:[]
	},
	answeredScenariosIdsLiver:{
	    type:[Mixed],
	    default:[]
	},
	gamified:{
	 type:Boolean,
	 default:false
	},
	awards:{
	 type:[Number],
	 default:[]
	},
	currectScenarioId:{
	 type:String,
	 default:""
	},
	currentScenarioPosition:{
	 type:Number,
	 default:-1
	},
	currentScenarioTopic:{
	 type:String,
	 default:""
	},
	currentScenarioScore:{
	 type:Number,
	 default:-1
	}
});

var User =  mongoose.model("User", ScenarioSchema);

module.exports = User;
