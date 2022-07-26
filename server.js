
var express = require("express");
var app = express();
var mongoose = require("mongoose");
const { registerUser, checkUser } = require("../../Documents/Seneca/Semester3/WEB322/assignment5/auth-service");
var Schema = mongoose.Schema;

//define userShcema
var userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]

})

var HTTP_PORT = process.env.PORT || 8080;



app.get("/", function (req, res) {
    res.send("Hello World<br /><a href='/about'>Go to the about page</a>");
});

let User; // to be defined on new connection (see initialize)
let pass1 = encodeURIComponent("Tatar333999!");
let db = mongoose.createConnection(`mongodb+srv://tobun:${pass1}@senecaweb.x4y7hbp.mongodb.net/web322_week8?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

db.on('error', (err) => {
    reject(err); // reject the promise with the provided error
});
db.once('open', () => {
    User = db.model("users", userSchema);

    var user1 = new User({
        userName: "Techatat",
        password: "12345",
        email: "tt@example.com",
    })

    user1.save().then(() => {
        console.log(`User1 created!!`);
        User.find({ userName: "Techatat" })
            .exec()
            .then((users) => {
                if (!users) {
                    console.log(`No user found`)
                } else {
                    console.log(`Found User: ${users[0].userName}`);
                    users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: "Techatat"})
                    console.log(users[0]);  
                    User.updateOne(
                        {userName: "Techatat"},
                        {$set: {loginHistory: users[0].loginHistory}})
                        .exec()
                }
            })
    })

})

    app.listen(HTTP_PORT, function () {
        console.log("app listening on: " + HTTP_PORT)
    })