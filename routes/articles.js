const express = require('express');
const router = express.Router();
const Article = require('../models/article');


router.get('/new', (req, res)=>{
    res.render('articles/new', {article: new Article()});
});

router.get('/edit/:id', async (req, res)=>{
    let article = await Article.findById(req.params.id);
    res.render('articles/edit', {article: article});
});

router.get('/:slug', async (req, res)=>{
let article  = await Article.findOne({slug: req.params.slug});
console.log('obtained article is: ', article);
if(article == null){
    res.redirect('/home');
}
res.render('articles/show', {article:article});
});

router.post('/', async (req, res, next) =>{
    //console.log('response is:', res);
    /* let article = new Article({
        title:req.body.title,
        description:req.body.description,
        markdown:req.body.markdown
    });

    try{
        article = await article.save();
        //console.log('saved article ', article);
        res.redirect(`articles/${article.slug}`);
        //res.render('articles/new', {article:article});
    }catch(e){
        console.log('error is', e);
        res.render('articles/new', {article:article});
    } */
    req.article = new Article();
    next();

}, saveAndRedirect('new'));

router.post('/delete/:id', async (req, res) => {
    console.log('inside delete ');
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/home');
});

router.post('/edit/save/:id', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveAndRedirect('new'));

function saveAndRedirect(path){
    return  async (req,res) =>{
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;

        try{
            article = await article.save();
            console.log('saved article ', article);
            res.redirect(`/articles/${article.slug}`);
            //res.render('articles/new', {article:article});
        }catch(e){
            console.log('error is', e);
            res.render(`/articles/${path}`, {article:article});
        }
    }
}

module.exports = router;
