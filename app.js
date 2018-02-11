var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost/nodesr');
var db = mongoose.connection;
//check connection
db.once('open', function () {
  console.log("connected to db");
});

//check for db errors
db.on('err', function(err) {
  console.log(err);
});

//improt model
var Article = require('./models/article');
//init app
var app = express();

//middleware forn body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());

//setup static folder
app.use(express.static(path.join(__dirname, 'public')));

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//home route
app.get('/', function (req, res) {
  Article.find({}, function (err, articles) {
    if (err) {
      console.log(err);
    } else {
      // rendering our view 
      res.render('index', {
        title: "Welcome to service reminder",
        articles: articles
      });
    }
  });
  //test sever is started
  console.log("server running on port 3000....");
});

//add article route
app.get('/articles/add', function(req, res) {
  res.render('add_article', {
    title: 'Add Article Here'
  })
});

//POST route for form submit data
app.post('/articles/add', function (req, res) {
  console.log("data submitted")
  var article = new Article({
  });
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  console.log(article);
  article.save(function(err){
    if(err){
      console.log(err);
      return;
    }else{
      res.redirect('/');
    }
  })   
})

//route get single route
app.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    console.log(article);
    res.render('article', {
      article:article
    });    
  });
});

//route to edit data and load form
app.get('/article/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    console.log(article);
    res.render('edit_article', {
      title:"Edit Article",
      article:article
    });    
  });
});

//route post edit/update data from edit form 
app.post('/articles/edit/:id', function (req, res) {
  var article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  var query = {_id:req.params.id}
  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }else{
      res.redirect('/');
    }
  })
  })   


app.listen(3000);