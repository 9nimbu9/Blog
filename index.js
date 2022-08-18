const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

var headings= []
var bodys=[]
var heading, body=""
var _ = require("lodash")

mongoose.connect("mongodb://localhost:27017/blogDB")
const app = express()
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname))

const textSchema = mongoose.Schema({
    heading: String,
    content: String
})
const Text = mongoose.model("text", textSchema)

app.get("/", function(req,res){
    Text.find({}, function(err,t){
        res.render("home", {title: t, content: t})
        for (var i=0;i<headings.length;i++){
            var h = headings[i]
            var c = bodys[i] 
            var iD = t[i]     
            app.get("/"+iD.id, function(req,res){
                res.render("extra", {title: h, content:c})
            })
        }
    })
})

app.get("/about",function(req,res){
    res.render("about")
})

app.get("/contact",function(req,res){
    res.render("contact")
})

app.get("/compose", function(req,res){
    res.render("compose")
})

app.post("/compose", function(req,res){
    const title = req.body.title
    const body = req.body.content
    
    const text = new Text({
        heading: title,
        content: body
    })
    text.save()

    headings.push(text.heading)
    bodys.push(text.content)
    res.redirect("/")
})

app.listen(3000, function(){
    console.log("Server 3000")
})