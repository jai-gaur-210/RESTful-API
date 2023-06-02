//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://jaigaur:jaigaur123@cluster0.pbknaev.mongodb.net/wikiDB", { useNewUrlParser: true }, { useUnifiedTopology: true })

articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

app.route("/articles")
.get((req, res) => {
    Article.find({}).then(function (err, articles) {
        if (!err) {
            res.send(articles)
        } else {
            res.send(err)
        }
    })
})
.post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save()
})
.delete((req, res) => {
    Article.deleteMany({}).then(function () {
        res.send("Data deleted");
    }).catch(function (error) {
        res.send(error);
    });
});


app.route("/articles/:articleTitle")
.get((req,res)=>{
    Article.findOne({title: req.params.articleTitle}).then(function (err, articles) {
        if (!err) {
            res.send(articles)
        } else {
            res.send(err)
        }
    })
})

.put((req,res)=>{
    Article.updateOne(
        {title: req.params.articleTitle} , 
        {title: req.body.title , content: req.body.content}).then(function(err){
            if(!err){
                res.send("updated")
            }else{
                res.send(err)
            }
        })
})

.patch((req,res)=>{
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
    ).then((err)=>{
        if(!err){
            res.send("updated successfully")
        }else{
            res.send(err)
        }
    })
})

.delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle}).then((err)=>{
        if(!err){
            res.send("Deleted successfull")
        }else{
            res.send(err)
        }
    })
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
});