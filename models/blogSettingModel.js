const mongoose = require('mongoose');

const blogsettingschema = new mongoose.Schema({
   blog_title:{
    type:String,
    required:true
   },
   blog_logo:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required : true
   },
});

module.exports= mongoose.model("blogsetting",blogsettingschema);
