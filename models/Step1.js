const mongoose = require('mongoose');

// Schema 
const { Schema } = mongoose;
const step1Schema = new Schema({
    p_id : { type:mongoose.Schema.Types.ObjectId, ref:'Patient'},
    height : {
      type : Number,
      required : [true,'*(필수) 신장을 적어주세요.'],
      match: [/^[0-9]{2,3}$/, '2자리 혹은 3자리의 숫자만 입력하세요.']    
    },
    weight: { 
      type : Number,
      required : [true, '*(필수) 몸무게를 입력해주세요.'],
      match: [/^[0-9]{,3}$/, '숫자만 입력하세요.']    
    },
    history : {
      type: String,
      default : "해당없음"
     },
    family_member : { 
      type: String ,
      default : "해당없음"
    },
    family_disease : { 
      type: String ,
      default : "해당없음"
    },
    drug : { 
      type:String,
      default : "해당없음"    
    },
    drink_week : {
      type:String,
      required : [true, '선택하세요.'],
    },
    drink_cnt : {
      type:String,
      required : [true, '선택하세요.'],
    },
    smoke_cnt : {
      type:String,
      required : [true, '선택하세요.'],
    }
});

  // model & export
var Step1 = mongoose.model('Step1', step1Schema);

module.exports = Step1;