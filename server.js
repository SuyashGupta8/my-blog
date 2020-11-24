const express = require('express');
const  articlerRouter = require('./routes/articles');
const mongoose = require('mongoose');
const uri = "mmongodb://localhost:27017/blog";
const cors = require('cors');
//const client = new MongoClient(uri);
const app = express();
const articles = require('./models/article');
const methodOverride = require('method-override');

mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true});


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
/* app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); */

  app.use(cors());

app.use('/articles', articlerRouter);
app.use(methodOverride('_method'));


/* const articles = [{
    title:'test Article',
    createdAt: new Date(),
    description:'test des'
}, {
    title:'test Article 2',
    createdAt: new Date(),
    description:'test des'
}]; */
app.get('/', (req, res)=>{
    res.redirect('/home') //reresnder('articles/index', {articles: articles});
});

app.get('/home', async (req, res)=>{
    let allArticles = await articles.find().sort({createdAt:'desc'});
    console.log('all articles are: ', allArticles);
    res.render('articles/index', {articles: allArticles});
});


app.listen(8000, ()=>{
    console.log('listening to port 8000');
});