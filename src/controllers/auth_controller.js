const { validationResult } = require('express-validator')
const User = require('../model/user_model')
const passport = require('passport')
require('../config/passport_local')(passport)
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const showLoginForm = (req, res, next) => {
    res.render('login', { layout: './layout/auth_layout.ejs', title:'Giriş Yap' })
}

const login = (req, res, next) => {
        
 const errors = validationResult(req)

    req.flash('email', req.body.email)
    req.flash('password', req.body.password)
  
    if(!errors.isEmpty()) { 
         
       req.flash('validation_error', errors.array())
       res.redirect('/login')

    } else {
        passport.authenticate('local', {
            successRedirect: '/administration',
            failureRedirect: 'login',
            failureFlash: true
        })(req, res, next)
    }

}

const showRegisterForm = (req, res, next) => {
    res.render('register', { layout: './layout/auth_layout.ejs', title:'Kaydol' })
}

const register = async (req, res, next) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {

        req.flash('validation_error', errors.array())
        req.flash('email', req.body.email)
        req.flash('firstName', req.body.firstName)
        req.flash('lastName', req.body.lastName)
        req.flash('password', req.body.password)
        req.flash('rePassword', req.body.rePassword)
        res.redirect('/register')
        
    } else {
        
        try {
            const _user = await User.findOne({ email: req.body.email })

            if (_user && _user.emailActive == true) {
                req.flash('validation_error', [{msg : "Bu mail kullanımda! Acaba daha önce kayıt olmuş olabilir misin? Şifreni yenilemeyi dene!"}])
                req.flash('email', req.body.email)
                req.flash('firstName', req.body.firstName)
                req.flash('lastName', req.body.lastName)
                req.flash('password', req.body.password)
                req.flash('rePassword', req.body.rePassword)
                res.redirect('/register')    
            } else if( (_user && _user.emailActive == false) || _user == null) {

                   if (_user) {
                       await User.findByIdAndRemove({ _id: _user._id })
                }
                const newUser = new User({
                    email:req.body.email,
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    password: await bcrypt.hash(req.body.password, 10)
                })
                await newUser.save()
               

                const jwtInformations = {
                    id: newUser.id,
                    mail: newUser.email
                }

                const jwtToken = jwt.sign(jwtInformations, process.env.CONFIRM_MAIL_JWT_SECRET, {expiresIn: '1d'
                })
                console.log(jwtToken)

                //Mail sending processes
                const url = process.env.WEB_SITE_URL + 'verify?id=' + jwtToken
                
     
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user:process.env.GMAIL_USER,
                        pass:process.env.GMAIL_PASSWORD
                    }
                })

                await transporter.sendMail({

                    from: 'UnutmAap  <info@unutmaap.com',
                    to: newUser.email,
                    subject : `Merhaba ${req.body.firstName}`,
                    text: "Hesabını doğrulamak için lütfen aşağıdaki doğrulama koduna tıkla." + url

                }, (error, info) => {
                    if (error) {
                        console.log("error" + error)
                    }
                    console.log("Mail gönderildi");
                    console.log(info);
                    transporter.close()
                })

                req.flash('success_message', [{msg : `${req.body.email} adresine doğrulama kodu gönderildi.Doğrulama kodun bağlantı hızına göre biraz gecikebilir.`}])
                res.redirect('/login')
            }
        } catch (err) {
            console.log("Kullanıcı kaydedilirken bir hata olıuştu")
        }
    }

}

const showForgetPasswordForm = (req, res, next) => {
    res.render('forget-password', { layout: './layout/auth_layout.ejs', title:'Şifreni mi Unuttun?' })
}

const forgetPassword = async (req, res, next) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()) {

        req.flash('validation_error', errors.array())
        req.flash('email', req.body.email)
       
        res.redirect('/forget-password')
    }
    //If the code below works, the user has entered an appropriate mail.    
     else {
        
        try {
            const _user = await User.findOne({email:req.body.email, emailActive:true})
            
            if (_user) {
                //Password reset message can be sent to the user.
              const jwtInformations = {
                id: _user.id,
                mail: _user.email
                }
                const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _user.password
                const jwtToken = jwt.sign(jwtInformations, secret, {expiresIn: '1d' })
                
                 //Mail sending processes
                 const url = process.env.WEB_SITE_URL + 'reset-password/'+_user.id+"/" + jwtToken
                 
      
                 let transporter = nodemailer.createTransport({
                     service: 'gmail',
                     secure: true,
                     auth: {
                         user:process.env.GMAIL_USER,
                         pass:process.env.GMAIL_PASSWORD
                     }
                 })
 
                 await transporter.sendMail({
 
                     from: 'UnutmAap  <info@unutmaap.com',
                     to: _user.email,
                     subject : `Merhaba ${_user.firstName}, Şifreni Güncelleyebilirsin.`,
                     text: "Şifreni güncellemek için lütfen aşağıdaki doğrulama koduna tıkla." + url
 
                 }, (error, info) => {
                     if (error) {
                         console.log("bir hata oluştu" + error);
                     }
                     console.log("Mail gönderidi")
                     console.log(info);
                     transporter.close()
                 })
 
                 req.flash('success_message', [{msg : `${req.body.email} adresine şifre güncelleme bağlantısı gönderildi.Bu kod bağlantı hızına göre biraz gecikebilir`}])
                 res.redirect('/login')

            } else {
                req.flash('validation_error', [{msg: "Bu mail kayıtlı değil veya hesap doğrulanmamış!"}])
                req.flash('email', req.body.email)
                res.redirect('forget-password')
            }
                
            
        } catch (err) {
            console.log("Kullanıcı kaydedilirken bir hata oluştu" + err)
        }
    }

    //res.render('forget-password', { layout: './layout/auth_layout.ejs' })
}

const logout = (req, res, next) => {
    req.logout(function(err) { 
        req.session.destroy((error) => {
            res.clearCookie('connect.sid');
            res.render('login', { layout: './layout/auth_layout.ejs', title:'Giriş Yap', success_message: [{ msg: 'Başarıyla çıkış yapıldı', }] }
            );
        });
    });
    
}

const verifyMail = (req, res, next) => {
     
    const token = req.query.id;
    if (token) {
        
      
     try {
        jwt.verify(token, process.env.CONFIRM_MAIL_JWT_SECRET, async (e, decoded) => {
          
            if (e) {
                req.flash('error', 'Kod hatalı veya süresi geçmiş.')
                res.redirect('/login')
            } else {

              const idValueInToken = decoded.id;
              const result = await User.findByIdAndUpdate(idValueInToken,
              {emailActive : true})

              if (result) {
                  req.flash("success_message", [{ msg: 'Hesabın başarıyla onaylandı' }])
                  res.redirect('/login')
              } else {
                req.flash("error", 'Lütfen tekrar kullanıcı oluştur.')
                res.redirect('/login')
              }
            }
        })
     } catch (err) {

     }

    } else {
        req.flash("error", 'Doğrulama kodu yok veya geçersiz!')
        res.redirect('/login')
    }
}

const saveNewPassword = async (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {

        req.flash('validation_error', errors.array())
        req.flash('password', req.body.password)
        req.flash('rePassword', req.body.rePassword)
       

        res.redirect('/reset-password/'+req.body.id+"/"+req.body.token)
    } else {

        const _foundUser = await User.findOne({ _id: req.body.id, emailActive: true })

        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _foundUser.password

        try {
            jwt.verify(req.body.token, secret, async (e, decoded) => {
                  
        if (e) {
            req.flash('error', 'Kod hatalı veya süresi geçmiş.')
            res.redirect('/forget-password')
            
        } else {
        //new password can be saved
       const hashedPassword = await bcrypt.hash(req.body.password, 10)
       const result = await User.findByIdAndUpdate(req.body.id, { password: hashedPassword})

        if (result) {
        req.flash("success_message", [{ msg: 'Şifre başarıyla değiştirildi' }])
        res.redirect('/login')

       } else {
        req.flash("error", 'Bir hata çıktı! Lütfen tekrar şifreni yenilemeyi dene')
        res.redirect('/login')
    }

  }
})
             
  } catch (err) {

        }
    }
}

const showNewPasswordForm = async (req, res, next) => {
    const idInLink = req.params.id
    const tokenInLink= req.params.token

    if (idInLink && tokenInLink) {

        const _foundUser = await User.findOne({ _id: idInLink })

        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _foundUser.password

            try {
                jwt.verify(tokenInLink, secret, async (e, decoded) => {
                  
                    if (e) {
                        req.flash('error', 'Kod hatalı veya süresi geçmiş.')
                        res.redirect('/forget-password')
                    } else {
                      
                      res.render('new-password', {id:idInLink, token:tokenInLink, layout: './layout/auth_layout.ejs', title:'Şifre Yenile'})
                      
                      /* const idValueInToken = decoded.id;
                      const result = await User.findByIdAndUpdate(idValueInToken,
                      {emailActive : true})
        
                      if (result) {
                          req.flash("success_message", [{ msg: 'Hesabın başarıyla onaylandı' }])
                          res.redirect('/login')
                      } else {
                        req.flash("error", 'Lütfen tekrar kullanıcı oluştur.')
                        res.redirect('/login')
                      } */
                    }
                })
             } catch (err) {
        


             }
    } else {
        req.flash('validation_error', [{msg: "Link Bulunamadı! Lütfen maildeki bağlantı linkini tıklayın."}])
        res.redirect('forget-password')
    }
}
 

module.exports = {
    showLoginForm,
    showRegisterForm,
    showForgetPasswordForm,
    register,
    login,
    forgetPassword,
    logout,
    verifyMail,
    showNewPasswordForm,
    saveNewPassword
}