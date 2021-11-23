const mongoose =  require('mongoose');


const uschema = mongoose.Schema({

    takenById:{
        type : Number,
        required : true
    },
    subjectCode:{
        type : String,
        required : true
    },
  
    createAt:{
        type : Date,
        default : Date.now()
    },
    presents:{type:Array ,default:[]}

});

var userSchema = mongoose.Schema({

  userid:String,    
    name: String,
    mode: String,


});


module.exports = mongoose.model("userProfile", UserSchema);

      