var mongoose = require('mongoose');

// Schema 
var step2Schema = mongoose.Schema({
    p_id : {type:mongoose.Schema.Types.ObjectId, ref:'Patient'},
    treat_time : { 
      type: String,
      required : [true,'*(필수) 초진여부를 체크해주세요.'],
    },
    treat_div : { 
      type: String,
      required : [true,'*(필수) 진료과목을 선택해주세요.'],
    },
    disease_desc : {
      type: String,
      required : [true,'*(필수) 증상내용을 적어주세요.'],
    },
    Dname:{
      type:String,
  },
    description:{
      type:String
    },
    write_date : { type: Date, default:Date.now }
});

  // model & export
var Step2 = mongoose.model('Step2', step2Schema);

module.exports = Step2;