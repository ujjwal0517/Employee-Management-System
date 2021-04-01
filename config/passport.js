const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
//load user model
const User = require('../model/users');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
        //match user
        User.findOne({
            email:email
        }).then(user=>{
            if(!user){
                return done(null, false, {message: "That email is not registered"})
            }
            //match password
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err) throw err;
                if(result){
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'password invalid'})
                }
            });
        });
    })
 );
 passport.serializeUser(function(user, done){
     done(null, user.id);
 })
 passport.deserializeUser(function(id, done){
     User.findById(id, function(err, user){
         done(err, user);
     });
 });
}
