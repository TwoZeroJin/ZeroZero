const mongoose = require('mongoose');
 
const { Schema } = mongoose;
const patientSchema = new Schema({
  p_id: {
    type:String,
    required:[true,'아이디를 입력해 주세요.'],
    match:[/^[a-zA-Z0-9]{6,}$/,'6자 이상, 숫자와 영문자만 됩니다.'],
    trim:true,
    unique:true
  },
  password : {
    type:String,
    required:[true,'비밀번호를 입력해 주세요.'],
    select:false
  },
  name:{
    type:String,
    required:[true,'이름을 입력해 주세요.'],
    trim:true
  },
  birth:{
    type:String,
    required:[true,'생년월일을 입력해 주세요.'],
  },
  ph_no:{
    type:String,
    required:[true,'전화번호를 입력해 주세요.'],
  },
  addr:{
    type:String,
    required:[true,'주소를 입력해 주세요.'],
  },
  email:{
    type:String,
    required:[true,'이메일을 입력해 주세요.'],
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'올바른 이메일을 입력해 주세요.'],
    trim:true
  },
  gender:{
    type:String,
    required:[true,'성별을 선택해 주세요.'],
  },
  gubun:{
    type:Number,
    default:1
  },
  reg_date:{
    type:Date,
    default:Date.now
  }
});



module.exports = mongoose.model('Patient', patientSchema);