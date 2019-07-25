//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//MongoDB Set Up Part
const databaseConnectionURL = "mongodb://localhost:27017/wikiDB";

mongoose.connect(databaseConnectionURL, {
    useNewUrlParser: true
}); // Establish connection

//Create Schema
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

//Create object model for our schema in the database
const Article = mongoose.model("Article", articleSchema);
//Setting the default items up


app.route("/articles")
    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {
        console.log(req.body.title);
        console.log(req.body.content);

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send(newArticle);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (err) res.send(err);
            else {
                res.send("Deleted all of the articles");
            }
        });
    });

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        const requestedPostId = req.params.articleTitle;
        Article.findOne({ title: requestedPostId}, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send(err);
            }
        });
    })
    .put(function (req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err,results){
                if(!err){
                    res.send("succesfully updated");
                }
            }
        );
    })
    .patch(function (req,res) { 
        Article.update({
            title: req.params.articleTitle
        },
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Succesfully updated");
            }
        }
        );
     })
     .delete(function(req,res){
         Article.deleteOne({title: req.params.articleTitle},function(err){
             if(!err){
                 res.send("successfully deleted");
             }
            }
        );
     });

    // .delete(function (req, res) {
    //     Article.deleteMany(function (err) {
    //         if (err) res.send(err);
    //         else {
    //             res.send("Deleted all of the articles");
    //         }
    //     });
    // });

// // app.get("/articles", );
// app.post("/articles", );

// app.delete("/articles",);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(3000, function () {
    console.log("Server started on port 3000");
});