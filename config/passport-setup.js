// const passport=require('passport');
// const GoogleStrategy=require('passport-google-oauth20');
// const keys=require('./keys');
// // 599807210860-rd4aid3bj7tmh71om5gcc6ekcfmr4tuu.apps.googleusercontent.com
// // qHjWSveojR_Tetqsec1iF25B
// passport.use(
//     new GoogleStrategy({
//         // option for google strat
//         clientID:keys.google.clientID,
//         clientSecret:keys.google.clientSecret,
//         callbackURL:'auth/google/redirect'

//     },()=>{
//         // passport callback function
//     })
// )
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');

const User=require('../models/users');

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then(user=>{
        console.log(user);
        done(null,user)
    }).catch(err=>{
        console.log(err);
    })
})
passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken,refreshToken,profile,done) => {
        // passport callback function
        console.log('passport callback function fired:');
        console.log(profile);
        User.findOne({googleId:profile.id}).then((currentUser)=>{
            if (currentUser){
                // user already in database
                console.log("user is",currentUser);
                // now call done function to call seializer
                done(null,currentUser);
            }
            else
            {
                new User({
                    username:profile.displayName,
                    googleId:profile.id,
                    thumbnail:profile._json.value
                }).save().then(newUser=>{
                    console.log("new user creactd",newUser);
                    // now call done function to call seializer
                    done(null,newUser);
                }).catch(err=>{
                    console.log(err);
                });
            }
        })
       
    })
);
