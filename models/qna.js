const mongoose = require('mongoose');

//schema
const { Schema } = mongoose;
const { Types:{ObjectId} } =Schema;
const qnaSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    reg_id:{
        type: ObjectId,
        ref: 'Patient', 
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{type:Date,},
});

module.exports = mongoose.model('Qna', qnaSchema);