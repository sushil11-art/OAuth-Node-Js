const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cookieSession=require('cookie-session');
const passportSetup=require('./config/passport-setup');

const passport=require('passport');

const authRoutes=require('./routes/auth-routes');
const profileRoutes=require('./routes/profile-routes');
const keys=require('./config/keys');

dotenv.config();
const app=express();

app.set('view engine','ejs');

app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[keys.session.cookieKey]

}))

// passport initialize
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);
app.get('/',(req,res)=>{
    res.render('home',{user:req.user});
})

mongoose.connect(process.env.DB_SECRET,{useNewUrlParser:true,useUnifiedTopology: true,
    useFindAndModify: false}).then(result=>{
    console.log('connected to db');
    console.log('app is running on port 4000');
    app.listen(4000);
}).catch(err=>{
    console.log(err);
});











