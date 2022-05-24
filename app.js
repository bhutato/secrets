const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const md5 = require("md5")
require('dotenv').config()

const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: md5(String)
})

const secret = process.env.SECRET

const User = mongoose.model("User", userSchema)

app.get('/', function(req,res){
    res.render("home")
})

app.get('/login', function(req,res){
    res.render("login")
})

app.get('/register', function(req,res){
    res.render("register")
})

app.get('/submit', function(req,res){
    res.render("submit")
})

app.get('/logout', function(req,res){
    res.redirect("/")
})


app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    
    const email =  req.body.username
    const password =  req.body.password

    User.findOne({email: email} , function(err,usernameTaken){
        if(err)
            console.log(err)
        else{
            if (usernameTaken){
                res.jsonp("username taken")
            }
        }
    })

    newUser.save(function(err){
        err ? console.log(err)  
        : res.render("secrets")   
    })
})

app.post("/login", function(req, res){
    const username =  req.body.username
    const password =  md5(req.body.password)

    User.findOne({email: username},function(err, foundUser){
        if (err)
            console.log(err)
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets")
                }
            }
        }
    })
})


let port = process.env.PORT
if (port == '' || port == null) {
    port = 3000
}

app.listen(port, function() {
    console.log(`server listening on ${port}`)
})
