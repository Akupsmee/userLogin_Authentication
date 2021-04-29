//jshint esversion:6
require('dotenv').config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))

console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology: true})

const userSchema = new mongoose.Schema({
    email:String,
    password: String
})


userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema)






app.get("/", (req, res)=>{
    res.render("home")
})

app.get("/login", (req, res)=>{
    res.render("login")
})

app.get("/register", (req, res)=>{
    res.render("register")
})

app.post("/register", (req, res)=>{
    const {username, password} = req.body

    const newUser = new User({
    email: username,
    password
     })

     newUser.save(err=>{
         if(err){
            console.log(err); 
         }else{
             res.render("secrets")
         }
     })  
    
})


app.post("/login", (req, res)=>{
    const {username, password} = req.body

    User.findOne({email : username}, (err, foundUser) =>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
               if(foundUser.password === password) {
                   res.render("secrets")
               }else{
                //    res.send("The credentials does not exist please register")
                   res.redirect("register")
               }
            }
        }
    })
    
})







app.listen(3000, (req, res)=>{
    console.log("app is been served on port 3000");
})