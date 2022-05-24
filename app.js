const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
require('dotenv').config()

const app = express()
const saltRounds = 10

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


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

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        
        const newUser = new User({
            email: req.body.username,
            password: hash
        })

        newUser.save(function(err){
            err ? console.log(err)  
            : res.render("secrets")   
        })
    });

    
    
    const email =  req.body.username

    User.findOne({email: email} , function(err,usernameTaken){
        if(err)
            console.log(err)
        else{
            if (usernameTaken){
                res.jsonp("username taken")
            }
        }
    })

})

app.post("/login", function(req, res){
    const username =  req.body.username
    const password = req.body.password

    User.findOne({email: username},function(err, foundUser){
        if (err)
            console.log(err)
        else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result)
                        res.render("secrets")  
                })
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
