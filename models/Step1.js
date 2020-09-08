var mongoose = require('mongoose');

// Schema 
var step1Schema = mongoose.Schema({
    p_id : { type:mongoose.Schema.Types.ObjectId, ref:'user'},
    height : { type:Number },
    weight: { type:Number },
    history : { type: String },
    family_member : { type: String },
    family_disease : { type: String },
    drug : { type:String},
    drink_week : { type:String },
    drink_cnt : { type:String },
    smoke_cnt : { type:String }
});

  // model & export
var Step1 = mongoose.model('step1', step1Schema);

module.exports = Step1;