//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://fruits:admin@cluster0.mkqmi6f.mongodb.net/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/logout", function (req, res) {
    res.render("home");
});

app.post("/register", function (req, res) {

    bcryptjs.hash(req.body.password, saltRounds, function (err, hash) {
    
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save().then(function () {
            res.render("secrets");
        }).catch(function (err) {
            console.log(err);
        });
    });
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }).then(function (foundUser) {
        if (foundUser) {
            bcryptjs.compare(password, foundUser.password, function (err, result) {
                if (result === true) {
                    res.render("secrets");
                }
            });
        }
    }).catch(function (err) {
        console.log(err);
    });
});




app.listen(3000, function () {
    console.log("Server started on port 3000");
});