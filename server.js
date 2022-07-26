
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
    "loginHistory":[{
        "dateTime": Date,
        "userAgent": String
    }]

})

var HTTP_PORT = process.env.PORT || 8080;



app.get("/", function(req,res){
    res.send("Hello World<br /><a href='/about'>Go to the about page</a>");
});

let User; // to be defined on new connection (see initialize)

function initialize() {
    return new Promise(function (resolve, reject) {
        let pass1 = encodeURIComponent("Tatar333999!");
        let db = mongoose.createConnection(`mongodb+srv://tobun:${pass1}@senecaweb.x4y7hbp.mongodb.net/web322_week8?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           User.find({userName: "Techatat"})
        .exec()
        .then((users)=>{
            console.log("Nexstep verify if array is not empty");
            if(!users){
                //if the array is empty meaning not found the user
                console.log(`Unable to find user: Techatat`);
                reject(`Unable to find user: Techatat}`);
            }else{
                console.log("password ", users[0].password);
                if(users[0].password === "12345"){
                    console.log("userName ", users[0].userName)
                   //users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                    console.log("Push process");
                    
                    console.log("Update login History ",users[0]);
                    User.updateOne(
                        { userName: users[0].userName },
                        { $set: { loginHistory: users[0].loginHistory } }
                    )
                    .exec()
                    .then((users)=>{
                        console.log(users[0]);
                        resolve(users[0]);
                    })
                    .catch(err => {
                        console.log(`There was an error verifying the user: ${err}`);
                        reject(`There was an error verifying the user: ${err}`);
                    });

        
                }else{
                    //if the password does not match
                    consoloe.log(`Incorrect Password for user:  ${userData.userName}`);
                    reject(`Incorrect Password for user:  ${userData.userName}`);
                }
            }
            users = users.map(value=>value => value.toObject());
        })
        .catch(()=>{
            reject(`Unable to find user: Techatat`)
        })
           resolve();
        });
    });
};

module.exports.registerUser = function(userData){
    return new Promise(function (resolve, reject){
        if(userData.password !== userData.password2){
            resolve("Password do not match");
        }else{
            let newUser = new User(userData);

            newUser.save().then((user)=>{
                console.log("Register User successful!")
                resolve(user)
            })
            .catch(err=>{
                console.log(err.code);
                if(err.code === 11000){
                    reject("User Name already taken")
                }else{
                    reject(`There was an error creating the user:  ${err}`)
                }
          });
        }
    })
}

function check(userData){

    return new Promise(function (resolve, reject){
        console.log(userData.userName);
        User.find({userName: userData.userName})
        .exec()
        .then((users)=>{
            console.log(users);
            if(!users){
                //if the array is empty meaning not found the user
                reject("Unable to find user: ", userData.userName);
            }else{
                if(users[0].password === userData.password){
                   /* users[0].update({
                        userName: userData.userName},
                        {$push: { loginHistory: {dateTime: (new Date()).toString(), userAgent: userData.userAgent}}})
                        .exec();*/
                    users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                    User.updateOne(
                        { userName: users[0].userName },
                        { $set: { loginHistory: users[0].loginHistory } }
                    )
                    .exec()
                    .then((users)=>{
                        resolve(users[0]);
                    })
                    .catch(err => {
                        reject(`There was an error verifying the user: ${err}`);
                    });

        
                }else{
                    //if the password does not match
                    reject(`Incorrect Password for user:  ${userData.userName}`);
                }
            }
            users = users.map(value=>value => value.toObject());
        })
        .catch(()=>{
            reject(`Unable to find user: ${userData.userName}`)
        })
    })
}


initialize()
.then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});


