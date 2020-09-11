const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types:{ObjectId} } =Schema;

const counterSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    count:{
        type: Number,
        default:0
    },
});

module.exports = mongoose.model('Counter', counterSchema);