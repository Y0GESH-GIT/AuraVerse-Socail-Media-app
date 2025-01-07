const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    location:{type:String},
    likescount:{type:Number,default:0},
    commentscount:{type:Number,default:0},
    peopletags:[String],
    posteddate:{type:Date,default:Date.now()},

})
const Post =new mongoose.model('Post',PostSchema);
module.exports=Post;

