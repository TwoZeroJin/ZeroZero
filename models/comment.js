const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types:{ObjectId} } =Schema;
const commentSchema = new Schema({
    post:{
        type: ObjectId,
        ref: 'Qna', 
        required:true
    },
    commenter:{
        type: ObjectId,
        ref: 'Patient', 
        required:true
    },
    parentComment:{
        type: ObjectId,
        ref: 'Comment'
    },
    text:{
        type:String,
        required:[true, 'text is required!']
    },
    isDeleted:{type:Boolean},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date},
    },{
        toObject:{virtuals:true}
});

commentSchema.virtual('childComments') //4
  .get(function(){ return this._childComments; })
  .set(function(value){ this._childComments=value; });


module.exports = mongoose.model('Comment', commentSchema);