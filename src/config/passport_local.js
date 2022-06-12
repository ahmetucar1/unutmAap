const LocalStrategy = require('passport-local').Strategy
const User = require('../model/user_model')
const bcrypt = require('bcrypt')

module.exports = function(passport) {
    const options = {
        usernameField: 'email',
        passwordField: 'password'
    }
    passport.use(new LocalStrategy(options, async (email, password, done) => {
        
       try {
           const _foundUser = await User.findOne({ email: email})

           if (!_foundUser) {
               return done(null, false, { message: 'Kullanıcı bulunamadı.'})
           }

           const passwordControl = await bcrypt.compare(password, _foundUser.password)
           if (!passwordControl) {
            return done(null, false, { message: 'Şifre Hatalı!'})
           } else {

           if(_foundUser && _foundUser.emailActive == false) {
            return done(null, false, { message: 'Lütfen hesabnızı onaylayın.' })
           } else  
            return done(null, _foundUser)
           }

       }   catch (err) {
           return done(err)
       }

    }))


passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {

     
    User.findById(id, function (err, user) {
    const newUser = {
       id:user.id,
       email: user.email,
       firstName: user.firstName,
       lastName: user.lastName,
       sifre: user.sifre,
       createdAt: user.createdAt,
       avatar: user.avatar,
    }    
    done(err, newUser)
    }) 
})


};