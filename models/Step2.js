var mongoose = require('mongoose');

// Schema 
var step2Schema = mongoose.Schema({
    p_id : {type:mongoose.Schema.Types.ObjectId, ref:'user'},
    treat_time   : { type: String  },
    treat_div    : { type: String  },
    disease_desc : { type: String },
    write_date   : { type: Date, default:Date.now }
});

  // model & export
var Step2 = mongoose.model('step2', step2Schema);

module.exports = Step2;