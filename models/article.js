var mongoose = require('mongoose');

//Articles schema
var articleSchema = mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true
  },
  body:{
    type:String,
    required:true
  } 
});

//export module with model name and schema name
var Article = module.exports = mongoose.model('article' , articleSchema);
